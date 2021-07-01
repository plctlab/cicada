import { Neutral } from "../../neutral"
import { Normal } from "../../normal"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import * as Sem from "../../sem"

export class ApNeutral extends Neutral {
  target: Neutral
  arg: Normal

  constructor(target: Neutral, arg: Normal) {
    super()
    this.target = target
    this.arg = arg
  }

  readback_neutral(ctx: Ctx): Core {
    return new Sem.Ap(
      this.target.readback_neutral(ctx),
      this.arg.readback_normal(ctx)
    )
  }
}
