import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Pi extends Exp {
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Pi {
    if (name === this.name) {
      return new Pi(this.name, subst(this.arg_t, name, exp), this.ret_t)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret_t = subst(this.ret_t, this.name, new Exps.Var(fresh_name))

      return new Pi(
        fresh_name,
        subst(this.arg_t, name, exp),
        subst(ret_t, name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.name)
    const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t = subst(this.ret_t, this.name, new Exps.Var(fresh_name))
    const ret_t_core = check(
      ctx.extend(fresh_name, arg_t_value),
      ret_t,
      new Exps.TypeValue()
    )

    return {
      t: new Exps.TypeValue(),
      core: new Exps.PiCore(fresh_name, arg_t_core, ret_t_core),
    }
  }

  flatten_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const entry = `${this.name}: ${this.arg_t.repr()}`

    if (this.ret_t instanceof Pi) {
      return this.ret_t.flatten_repr([...entries, entry])
    } else {
      return {
        entries: [...entries, entry],
        ret_t: this.ret_t.repr(),
      }
    }
  }

  repr(): string {
    const { entries, ret_t } = this.flatten_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }
}
