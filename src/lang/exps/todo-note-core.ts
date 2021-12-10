import { AlphaCtx, Core } from "../core"
import { Env } from "../env"
import * as Exps from "../exps"
import { Value } from "../value"

export class TodoNoteCore extends Core {
  note: string
  t: Value

  constructor(note: string, t: Value) {
    super()
    this.note = note
    this.t = t
  }

  evaluate(env: Env): Value {
    return new Exps.NotYetValue(
      this.t,
      new Exps.TodoNoteNeutral(this.note, this.t)
    )
  }

  format(): string {
    const note = new Exps.QuoteCore(this.note).format()
    return `TODO_NOTE(${note})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return this.format()
  }
}
