import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import * as ut from "../../../ut"
import * as Exps from "../../exps"

export class DatatypeValue extends Value {
  name: string
  parameters: Record<string, Core>
  indexes: Record<string, Core>
  ctors: Record<string, Core>
  env: Env

  constructor(
    name: string,
    parameters: Record<string, Core>,
    indexes: Record<string, Core>,
    ctors: Record<string, Core>,
    env: Env
  ) {
    super()
    this.name = name
    this.parameters = parameters
    this.indexes = indexes
    this.ctors = ctors
    this.env = env
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    throw new Error("TODO")
  }

  unify(solution: Solution, that: Value): Solution {
    throw new Error("TODO")
  }
}
