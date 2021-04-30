import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TypeValue } from "../../exps"
import { NatValue } from "../../exps"

export class Nat extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new NatValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Nat"
  }
}
