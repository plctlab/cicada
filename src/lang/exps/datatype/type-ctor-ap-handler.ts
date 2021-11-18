import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export class TypeCtorApHandler extends ApHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    if (this.target.arity === 0) {
      throw new Error("I can not apply TypeCtorValue of arity 0.")
    }

    const args = [arg]

    if (this.target.arity === 1) {
      return new Exps.DatatypeValue(this.target, args)
    }

    return new Exps.CurriedTypeCtorValue(this.target, args)
  }
}
