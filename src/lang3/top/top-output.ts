import { evaluator } from "../evaluator"
import * as Top from "../top"
import * as Mod from "../mod"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Infer from "../infer"
import * as Evaluate from "../evaluate"
import * as Readback from "../readback"

export function output(mod: Mod.Mod, top: Top.Top): string {
  if (top.kind === "Top.show") {
    const env = Env.init()
    const ctx = Ctx.init()
    const t = Infer.infer(mod, ctx, top.exp)
    const value = evaluator.evaluate(top.exp, {mod, env})
    const value_repr = Exp.repr(Readback.readback(mod, ctx, t, value))
    return `${value_repr}\n`
  }

  return ""
}
