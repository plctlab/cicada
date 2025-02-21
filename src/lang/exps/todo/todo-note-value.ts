import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"

export class TodoNoteValue extends Exps.BuiltInValue {
  name = "TODO_NOTE"
  arity = 2

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TodoNoteValue([...this.arg_value_entries, arg_value_entry])
  }

  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    const t_core = readback(ctx, new Exps.TypeValue(), t)

    const note = arg_entries[0]

    if (note !== undefined && note.kind === "plain") {
      ctx.broadcast({
        tag: "todo",
        msg: [
          `${ctx.highlight("warn", "TODO_NOTE")}(${ctx.highlight(
            "note",
            note.exp.format()
          )})`,
          `  ${ctx.highlight("code", t_core.format())}`,
        ].join("\n"),
      })
    } else {
      ctx.broadcast({
        tag: "todo",
        msg: [
          `${ctx.highlight("warn", "TODO_NOTE")}`,
          `  ${ctx.highlight("code", t_core.format())}`,
        ].join("\n"),
      })
    }
  }

  // NOTE `(vague T: Type, note: String) -> T`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.VaguePiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.PiCore(
          "note",
          new Exps.BuiltInCore("String"),
          new Exps.VarCore("T")
        )
      )
    )
  }
}
