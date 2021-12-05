import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Solution } from "../../solution"
import { Value } from "../../value"

export class ReflValue extends Value {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.EqualValue) {
      return new Exps.ReflCore()
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.ReflValue)) {
      return Solution.failure
    }

    return solution
  }
}
