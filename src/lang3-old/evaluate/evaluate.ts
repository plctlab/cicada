import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Pattern from "../pattern"
import * as Mod from "../mod"
import * as Env from "../env"
import * as Trace from "../../trace"

export type EvaluationOpts = {
  mode?: EvaluationMode
}

export enum EvaluationMode {
  mute_recursive_exp_in_mod = "mute_recursive_exp_in_mod",
}

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp,
  opts: EvaluationOpts = {}
): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const value = Env.lookup(env, exp.name)
        if (value !== undefined) return value

        const mod_value = Mod.lookup_value(mod, exp.name)
        if (mod_value === undefined)
          throw new Trace.Trace(Explain.explain_name_undefined(exp.name))

        if (opts.mode === EvaluationMode.mute_recursive_exp_in_mod) {
          // TODO We SHOULD NOT do this for non recursive `Den`.
          Mod.update(mod, exp.name, Mod.lookup_den(mod, exp.name)!, {
            cached_value: Value.not_yet(
              Mod.lookup_type(mod, exp.name)!,
              Neutral.v(exp.name)
            ),
          })
        }

        return mod_value
      }
      case "Exp.pi": {
        return Value.pi(
          Evaluate.evaluate(mod, env, exp.arg_t, opts),
          Value.Closure.create(mod, env, Pattern.v(exp.name), exp.ret_t)
        )
      }
      case "Exp.fn": {
        return Value.fn(Value.Closure.create(mod, env, exp.pattern, exp.ret))
      }
      case "Exp.case_fn": {
        return Value.case_fn(
          exp.cases.map(({ pattern, ret }) =>
            Value.Closure.create(mod, env, pattern, ret)
          )
        )
      }
      case "Exp.ap": {
        return Evaluate.do_ap(
          Evaluate.evaluate(mod, env, exp.target, opts),
          Evaluate.evaluate(mod, env, exp.arg, opts)
        )
      }
      case "Exp.cls": {
        env = Env.clone(env)
        const sat = new Array()
        for (const entry of exp.sat) {
          const name = entry.name
          const t = Evaluate.evaluate(mod, env, entry.t, opts)
          const value = Evaluate.evaluate(mod, env, entry.exp, opts)
          sat.push({ name, t, value })
          Env.update(env, name, value)
        }
        if (exp.scope.length === 0) {
          return Value.cls(
            sat,
            Value.Telescope.create(mod, env, undefined, new Array())
          )
        } else {
          const [entry, ...tail] = exp.scope
          const name = entry.name
          const t = Evaluate.evaluate(mod, env, entry.t, opts)
          return Value.cls(
            sat,
            Value.Telescope.create(mod, env, { name, t }, tail)
          )
        }
      }
      case "Exp.obj": {
        const { properties } = exp
        return Value.obj(
          new Map(
            Array.from(properties, ([name, exp]) => [
              name,
              Evaluate.evaluate(mod, env, exp, opts),
            ])
          )
        )
      }
      case "Exp.dot": {
        return Evaluate.do_dot(
          Evaluate.evaluate(mod, env, exp.target, opts),
          exp.name
        )
      }
      case "Exp.equal": {
        return Value.equal(
          Evaluate.evaluate(mod, env, exp.t, opts),
          Evaluate.evaluate(mod, env, exp.from, opts),
          Evaluate.evaluate(mod, env, exp.to, opts)
        )
      }
      case "Exp.same": {
        return Value.same
      }
      case "Exp.replace": {
        return Evaluate.do_replace(
          Evaluate.evaluate(mod, env, exp.target, opts),
          Evaluate.evaluate(mod, env, exp.motive, opts),
          Evaluate.evaluate(mod, env, exp.base, opts)
        )
      }
      case "Exp.absurd": {
        return Value.absurd
      }
      case "Exp.absurd_ind": {
        return Evaluate.do_absurd_ind(
          Evaluate.evaluate(mod, env, exp.target, opts),
          Evaluate.evaluate(mod, env, exp.motive, opts)
        )
      }
      case "Exp.str": {
        return Value.str
      }
      case "Exp.quote": {
        return Value.quote(exp.str)
      }
      case "Exp.union": {
        const { left, right } = exp
        return Value.union(
          Evaluate.evaluate(mod, env, left, opts),
          Evaluate.evaluate(mod, env, right, opts)
        )
      }
      case "Exp.type_constructor": {
        return Value.type_constructor(
          exp.name,
          Evaluate.evaluate(mod, env, exp.t, opts),
          Value.DelayedSums.create(exp.sums, mod, env)
        )
      }
      case "Exp.type": {
        return Value.type
      }
      case "Exp.begin": {
        env = Env.clone(env)
        for (const stmt of exp.stmts) {
          Stmt.execute(mod, env, stmt)
        }
        return Evaluate.evaluate(mod, env, exp.ret, opts)
      }
      case "Exp.the": {
        return Evaluate.evaluate(mod, env, exp.exp, opts)
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }

    throw error
  }
}
