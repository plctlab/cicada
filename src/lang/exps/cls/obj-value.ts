import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import { Value } from "../../value"

export class ObjValue extends Value {
  properties: Map<string, Value>

  constructor(properties: Map<string, Value>) {
    super()
    this.properties = properties
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }

  get(name: string): Value {
    const value = this.properties.get(name)
    if (value === undefined) {
      throw new ExpTrace(`The property name: ${name} of object is undefined.`)
    }

    return value
  }
}
