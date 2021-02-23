import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import * as Explain from "../explain"
import * as Trace from "../trace"

export class Var implements Exp {
  name: string

  constructor(name: string) {
    this.name = name
  }

  evaluate(env: Env): Value.Value {
    const result = env.lookup(this.name)
    if (result === undefined) {
      throw new Trace.Trace(Explain.explain_name_undefined(this.name))
    }
    return result
  }

  infer(ctx: Ctx): Value.Value {
    const t = ctx.lookup(this.name)
    if (t === undefined) {
      throw new Trace.Trace(Explain.explain_name_undefined(this.name))
    }
    return t
  }

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const depth = ctx.depths.get(this.name)
    if (depth === undefined) return this.name
    return `[${depth}]`
  }
}
