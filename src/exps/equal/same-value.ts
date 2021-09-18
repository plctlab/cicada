import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class SameValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EqualValue) {
      return new Exps.SameCore()
    }
  }

  unify(subst: Solution, that: Value): Solution {
    if (that instanceof Exps.SameValue) {
      return subst
    } else {
      return Solution.failure
    }
  }
}
