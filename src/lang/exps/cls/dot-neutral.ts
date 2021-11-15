import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class DotNeutral extends Neutral {
  target: Neutral
  name: string

  constructor(target: Neutral, name: string) {
    super()
    this.target = target
    this.name = name
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.DotCore(this.target.readback_neutral(ctx), this.name)
  }

  unify(ctx: Ctx, solution: Solution, that: Neutral): Solution {
    if (that instanceof DotNeutral && this.name === that.name) {
      return solution.unify_neutral(ctx, this.target, that.target)
    } else {
      return Solution.failure
    }
  }
}
