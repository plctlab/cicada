import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { readback } from "../../readback"
import * as Cores from "../../cores"

export class InrValue extends Value {
  right: Value

  constructor(right: Value) {
    super()
    this.right = right
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.EitherValue) {
      return new Cores.Inl(readback(ctx, t.right_t, this.right))
    }
  }
}
