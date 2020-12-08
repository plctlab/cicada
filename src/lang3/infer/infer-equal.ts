import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_equal(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  equal: Exp.equal
): Value.type {
  Check.check(mod, ctx, equal.t, Value.type)
  const t = evaluator.evaluate(equal.t, { mod, env: Ctx.to_env(ctx) })
  Check.check(mod, ctx, equal.from, t)
  Check.check(mod, ctx, equal.to, t)
  return Value.type
}
