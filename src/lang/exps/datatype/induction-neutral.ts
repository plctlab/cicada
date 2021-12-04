import { Neutral } from "../../neutral"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"

export class InductionNeutral extends Neutral {
  target: Neutral
  motive: Normal
  case_entries: Array<Exps.CaseNormalEntry>

  constructor(
    target: Neutral,
    motive: Normal,
    case_entries: Array<Exps.CaseNormalEntry>
  ) {
    super()
    this.target = target
    this.motive = motive
    this.case_entries = case_entries
  }

  readback_neutral(ctx: Ctx): Core {
    return new Exps.InductionCore(
      this.target.readback_neutral(ctx),
      this.motive.readback_normal(ctx),
      this.case_entries.map((case_entry) => ({
        ...case_entry,
        core: case_entry.normal.readback_normal(ctx),
      }))
    )
  }

  unify_neutral(solution: Solution, ctx: Ctx, that: Neutral): Solution {
    if (!(that instanceof InductionNeutral)) {
      return Solution.failure
    }

    solution = solution
      .unify_neutral(ctx, this.target, that.target)
      .unify_normal(ctx, this.motive, that.motive)

    solution = unify_case_entries(
      solution,
      ctx,
      this.case_entries,
      that.case_entries
    )

    return solution
  }
}

function unify_case_entries(
  solution: Solution,
  ctx: Ctx,
  this_case_entries: Array<Exps.CaseNormalEntry>,
  that_case_entries: Array<Exps.CaseNormalEntry>
): Solution {
  throw new Error("TODO")
}
