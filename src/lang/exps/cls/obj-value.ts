import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { ExpTrace } from "../../errors"
import * as ut from "../../../ut"
import { ObjDotHandler } from "./obj-dot-handler"

export class ObjValue extends Value {
  properties: Map<string, Value>

  constructor(properties: Map<string, Value>) {
    super()
    this.properties = properties
  }

  dot_handler = new ObjDotHandler(this)

  readback(ctx: Ctx, t: Value): Core | undefined {
    // NOTE eta expand
    return undefined
  }
}
