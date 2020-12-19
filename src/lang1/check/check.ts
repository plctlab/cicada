import * as Check from "../check"
import * as Infer from "../infer"
import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Ty from "../ty"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Ty.Ty): void {
  try {
    if (exp.kind === "Exp.fn") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.zero") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.add1") {
      return exp.checkability(t, { ctx })
    } else if (exp.kind === "Exp.begin") {
      const { stmts, ret } = exp
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      Check.check(new_ctx, ret, t)
    } else {
      const u = Infer.infer(ctx, exp)
      // NOTE Comparing equivalent between `Ty` is simple.
      // - For dependent type, we will need to use `Value.conversion`.
      if (ut.equal(t, u)) {
      } else {
        throw new Trace.Trace(
          ut.aline(`
            |When checking ${exp.repr()},
            |I infer the type to be ${Ty.repr(u)},
            |but the given type is ${Ty.repr(t)}.
            |`)
        )
      }
    }
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}
