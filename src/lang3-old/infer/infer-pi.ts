import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_pi(mod: Mod.Mod, ctx: Ctx.Ctx, pi: Exp.pi): Value.type {
  Check.check(mod, ctx, pi.arg_t, Value.type)
  Check.check(
    mod,
    Ctx.extend(ctx, pi.name, Evaluate.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)),
    pi.ret_t,
    Value.type
  )
  return Value.type
}
