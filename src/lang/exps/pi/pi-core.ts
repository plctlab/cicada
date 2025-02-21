import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { Closure } from "../closure"
import { PiFormater } from "./pi-formater"

export class PiCore extends Core {
  name: string
  arg_t: Core
  ret_t: Core

  constructor(name: string, arg_t: Core, ret_t: Core) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  evaluate(env: Env): Value {
    return new Exps.PiValue(
      evaluate(env, this.arg_t),
      new Closure(env, this.name, this.ret_t)
    )
  }

  pi_formater = new PiFormater(this)

  format(): string {
    return this.pi_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const ret_t_format = this.ret_t.alpha_format(ctx.extend(this.name))
    return `(${arg_t_format}) -> ${ret_t_format}`
  }
}
