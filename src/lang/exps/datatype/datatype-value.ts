import * as Exps from ".."
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Solution } from "../../solution"
import { expect, readback, Value } from "../../value"

export class DatatypeValue extends Value {
  type_ctor: Exps.TypeCtorValue
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.args = args
  }

  get fixed_args(): Array<Value> {
    return this.args.slice(0, this.type_ctor.fixed_arity)
  }

  get varied_args(): Array<Value> {
    return this.args.slice(this.type_ctor.fixed_arity)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      let result: Core = new Exps.VarCore(this.type_ctor.name)
      let self_type = this.type_ctor.self_type()
      for (const [index, arg] of this.args.entries()) {
        const pi = expect(ctx, self_type, Exps.PiValue)
        self_type = Exps.PiValue.apply(pi, arg)
        const arg_t = readback(ctx, pi.arg_t, arg)
        result = new Exps.ApCore(result, arg_t)
      }

      return result
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (!(that instanceof Exps.DatatypeValue)) {
      return Solution.failure
    }

    // TODO `t` in the arguments is not used here.
    const self_type = this.type_ctor.self_type()
    return solution
      .unify(ctx, self_type, this.type_ctor, that.type_ctor)
      .unify_args(ctx, self_type, this.args, that.args)
  }
}
