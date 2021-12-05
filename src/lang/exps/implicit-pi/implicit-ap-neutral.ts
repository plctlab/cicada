import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Solution } from "../../solution"

export class ImplicitApNeutral extends Neutral {
  target: Neutral
  arg: Normal

  constructor(target: Neutral, arg: Normal) {
    super()
    this.target = target
    this.arg = arg
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.ImplicitApCore(
      this.target.readback_neutral(ctx),
      this.arg.readback_normal(ctx)
    )
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof ImplicitApNeutral)) {
      return Solution.failure
    }

    return solution
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.arg, that.arg)
  }
}
