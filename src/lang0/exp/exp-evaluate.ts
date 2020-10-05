import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Trace from "../../trace"

export function evaluate(env: Env.Env, exp: Exp.Exp): Value.Value {
  try {
    switch (exp.kind) {
      case "Exp.v": {
        const result = Env.lookup(env, exp.name)
        if (result === undefined) {
          throw new Trace.Trace(Exp.explain_name_undefined(exp.name))
        }
        return result
      }
      case "Exp.fn": {
        return Value.fn(exp.name, exp.ret, env)
      }
      case "Exp.ap": {
        return Exp.do_ap(evaluate(env, exp.target), evaluate(env, exp.arg))
      }
      case "Exp.suite": {
        for (const def of exp.defs) {
          env = Env.update(Env.clone(env), def.name, evaluate(env, def.exp))
        }
        return evaluate(env, exp.ret)
      }
    }
  } catch (error) {
    Trace.maybe_push(error, exp)
  }
}
