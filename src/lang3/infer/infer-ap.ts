import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_ap(mod: Mod.Mod, ctx: Ctx.Ctx, ap: Exp.ap): Value.Value {
  const target_t = Infer.infer(mod, ctx, ap.target)
  if (target_t.kind === "Value.pi")
    return when_target_is_pi(mod, ctx, target_t, ap)
  if (target_t.kind === "Value.type") return when_target_is_type(mod, ctx, ap)

  throw new Trace.Trace(
    Value.unexpected(mod, ctx, target_t, {
      message: `I am expecting the target_t to be pi or type.`,
    })
  )
}

function when_target_is_pi(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi,
  ap: Exp.ap
): Value.Value {
  Check.check(mod, ctx, ap.arg, pi.arg_t)
  return Value.Closure.apply(
    pi.ret_t_cl,
    evaluator.evaluate(ap.arg, { mod, env: Ctx.to_env(ctx) })
  )
}

function when_target_is_type(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  ap: Exp.ap
): Value.Value {
  const target = evaluator.evaluate(ap.target, { mod, env: Ctx.to_env(ctx) })
  const cls = Value.is_cls(mod, ctx, target)
  if (cls.tel.next === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |The telescope of the cls is full.
        |`)
    )
  }
  Check.check(mod, ctx, ap.arg, cls.tel.next.t)
  return Value.type
}
