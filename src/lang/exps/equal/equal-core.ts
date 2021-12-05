import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class EqualCore extends Core {
  t: Core
  from: Core
  to: Core

  constructor(t: Core, from: Core, to: Core) {
    super()
    this.t = t
    this.from = from
    this.to = to
  }

  evaluate(env: Env): Value {
    return new Exps.EqualValue(
      evaluate(env, this.t),
      evaluate(env, this.from),
      evaluate(env, this.to)
    )
  }

  format(): string {
    return `Equal(${this.t.format()}, ${this.from.format()}, ${this.to.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `Equal(${this.t.alpha_format(ctx)}, ${this.from.alpha_format(
      ctx
    )}, ${this.to.alpha_format(ctx)})`
  }
}
