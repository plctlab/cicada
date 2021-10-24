import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class VectorTailNeutral extends Neutral {
  target: Neutral

  constructor(target: Neutral) {
    super()
    this.target = target
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.VectorTailCore(this.target.readback_neutral(ctx))
  }


  unify(solution: Solution, that: Neutral): Solution {
    if (that instanceof VectorTailNeutral) {
      return solution.unify_neutral(this.target, that.target)
    } else {
      return Solution.failure
    }
  }  
}
