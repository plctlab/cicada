import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Exps from "../../exps"
import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Solution } from "../../solution"

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
      return Solution.fail_to_be_the_same_neutral(ctx, this, that)
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
  this_case_entries = this_case_entries.sort(Exps.compare_case_entries)
  that_case_entries = that_case_entries.sort(Exps.compare_case_entries)

  if (this_case_entries.length !== that_case_entries.length) {
    return Solution.failure(
      [
        `When unifying InductionNeutral,`,
        `I expect case entries have the same length.`,
        `  this case entries length: ${this_case_entries.length}`,
        `  that case entries length: ${that_case_entries.length}`,
      ].join("\n")
    )
  }

  for (const [index] of this_case_entries.entries()) {
    solution = unify_case_entry(
      solution,
      ctx,
      this_case_entries[index],
      that_case_entries[index]
    )
  }

  return solution
}

function unify_case_entry(
  solution: Solution,
  ctx: Ctx,
  this_case_entry: Exps.CaseNormalEntry,
  that_case_entry: Exps.CaseNormalEntry
): Solution {
  if (this_case_entry.name !== that_case_entry.name) {
    return Solution.failure(
      [
        `When unifying InductionNeutral,`,
        `I expect case entry to be the same.`,
        `  this case entry name: ${this_case_entry.name}`,
        `  that case entry name: ${that_case_entry.name}`,
      ].join("\n")
    )
  }

  return solution.unify_normal(
    ctx,
    this_case_entry.normal,
    that_case_entry.normal
  )
}
