import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value, Subst } from "../../value"
import * as Exps from "../../exps"

export class AbsurdValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      return new Exps.AbsurdCore()
    }
  }

  unify(subst: Subst, x: Value): Subst | undefined {
    if (x instanceof Exps.AbsurdValue) {
      return subst
    }
  }
}
