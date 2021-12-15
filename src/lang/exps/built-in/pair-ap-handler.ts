import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class PairApHandler extends ApHandler {
  target: Exps.PairValue

  constructor(target: Exps.PairValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arg_value_entries.length < this.target.arity - 1) {
      return this.target.curry({ kind: "plain", value: arg })
    } else {
      const env = Env.init()
        .extend("A", this.target.arg_value_entries[0].value)
        .extend("B", arg)

      const t = new Exps.SigmaCore(
        "_",
        new Exps.VariableCore("A"),
        new Exps.VariableCore("B")
      )

      return evaluate(env, t)
    }
  }
}
