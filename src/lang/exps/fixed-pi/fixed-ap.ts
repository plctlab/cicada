import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Env } from "../../env"
import { Ctx } from "../../ctx"
import { infer } from "../../exp"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { ExpTrace, InternalError } from "../../errors"
import * as Exps from "../../exps"
import { ApFormater } from "../pi/ap-formater"

export class FixedAp extends Exp {
  meta: ExpMeta
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp, meta: ExpMeta) {
    super()
    this.target = target
    this.arg = arg
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): FixedAp {
    return new FixedAp(
      subst(this.target, name, exp),
      subst(this.arg, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred = infer(ctx, this.target)

    if (inferred.t instanceof Exps.FixedPiValue) {
      const { arg_t, ret_t_cl } = inferred.t
      const arg_core = check(ctx, this.arg, arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)
      return {
        t: ret_t_cl.apply(arg_value),
        core: new Exps.FixedApCore(inferred.core, arg_core),
      }
    }

    throw new ExpTrace(
      [
        `I expect the inferred type to be FixedPiValue`,
        `  class name: ${inferred.t.constructor.name}`,
      ].join("\n")
    )
  }

  ap_formater = new ApFormater(this, {
    decorate_arg: (arg) => `fixed ${arg}`,
  })

  format(): string {
    return this.ap_formater.format()
  }
}
