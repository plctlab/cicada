import * as ut from "../../../ut"
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { LetFormater } from "./let-formater"

export class Let extends Exp {
  meta: ExpMeta
  name: string
  exp: Exp
  ret: Exp

  constructor(name: string, exp: Exp, ret: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.name = name
    this.exp = exp
    this.ret = ret
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.exp.free_names(bound_names),
      ...this.ret.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Let {
    if (name === this.name) {
      return new Let(this.name, subst(this.exp, name, exp), this.ret, this.meta)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)

      return new Let(
        fresh_name,
        subst(this.exp, name, exp),
        subst(subst(this.ret, this.name, new Exps.Var(fresh_name)), name, exp),
        this.meta
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.name)
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.toEnv(), inferred.core)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const inferred_ret = infer(ctx.extend(fresh_name, inferred.t, value), ret)
    return {
      t: inferred_ret.t,
      core: new Exps.LetCore(fresh_name, inferred.core, inferred_ret.core),
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const fresh_name = ctx.freshen(this.name)
    const inferred = infer(ctx, this.exp)
    const value = evaluate(ctx.toEnv(), inferred.core)
    const ret = subst(this.ret, this.name, new Exps.Var(fresh_name))
    const ret_core = check(ctx.extend(fresh_name, inferred.t, value), ret, t)
    return new Exps.LetCore(fresh_name, inferred.core, ret_core)
  }

  let_formater = new LetFormater(this)

  format(): string {
    return this.let_formater.format()
  }
}
