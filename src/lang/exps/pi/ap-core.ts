import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class ApCore extends Core {
  target: Core
  arg: Core

  constructor(target: Core, arg: Core) {
    super()
    this.target = target
    this.arg = arg
  }

  evaluate(env: Env): Value {
    return ApCore.apply(evaluate(env, this.target), evaluate(env, this.arg))
  }

  format(): string {
    const target = this.ap_target_format()
    const args = this.ap_args_format().join(", ")
    return `${target}(${args})`
  }

  ap_args_format(): Array<string> {
    if (has_ap_args_format(this.target)) {
      return [...this.target.ap_args_format(), this.arg.format()]
    } else {
      return [this.arg.format()]
    }
  }

  ap_target_format(): string {
    if (has_ap_target_format(this.target)) {
      return this.target.ap_target_format()
    } else {
      return this.target.format()
    }
  }

  alpha_format(ctx: AlphaCtx): string {
    return `${this.target.alpha_format(ctx)}(${this.arg.alpha_format(ctx)})`
  }

  static apply(target: Value, arg: Value): Value {
    if (target.ap_handler) {
      return target.ap_handler.apply(arg)
    }

    if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.PiValue) {
        return new Exps.NotYetValue(
          t.ret_t_cl.apply(arg),
          new Exps.ApNeutral(neutral, new Normal(t.arg_t, arg))
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.PiValue],
        })
      }
    }

    throw InternalError.wrong_target(target, {
      expected: [Exps.FnValue, Exps.NilClsValue, Exps.ConsClsValue],
    })
  }
}

function has_ap_args_format(
  core: Core
): core is Core & { ap_args_format(): Array<string> } {
  return (core as any).ap_args_format instanceof Function
}

function has_ap_target_format(
  core: Core
): core is Core & { ap_target_format(): string } {
  return (core as any).ap_target_format instanceof Function
}
