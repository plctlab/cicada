import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { readback } from "../../readback"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"
import { nanoid } from "nanoid"

export class ListRec extends Exp {
  target: Exp
  base: Exp
  step: Exp

  constructor(target: Exp, base: Exp, step: Exp) {
    super()
    this.target = target
    this.base = base
    this.step = step
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const list_t = expect(ctx, inferred_target.t, Cores.ListValue)
    const elem_t = list_t.elem_t
    const inferred_base = infer(ctx, this.base)
    const target_t_core = readback(
      ctx,
      new Cores.TypeValue(),
      inferred_target.t
    )
    const base_t_core = readback(ctx, new Cores.TypeValue(), inferred_base.t)
    const target_name = "list_rec_target_list_" + nanoid().toString()
    const motive_core = new Cores.The(
      new Cores.Pi(target_name, target_t_core, base_t_core),
      new Cores.Fn(target_name, inferred_base.core))
    const step_core = check(
      ctx,
      this.step,
      list_rec_step_t(inferred_base.t, elem_t)
    )

    return {
      t: inferred_base.t,
      core: new Cores.ListInd(
        inferred_target.core,
        motive_core,
        inferred_base.core,
        step_core
      ),
    }
  }

  repr(): string {
    return `list_rec(${this.target.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }
}

function list_rec_step_t(base_t: Value, elem_t: Value): Value {
  return evaluate(
    new Env().extend("base_t", base_t).extend("elem_t", elem_t),
    new Cores.Pi(
      "head",
      new Cores.Var("elem_t"),
      new Cores.Pi(
        "tail",
        new Cores.List(new Cores.Var("elem_t")),
        new Cores.Pi("almost", new Cores.Var("base_t"), new Cores.Var("base_t"))
      )
    )
  )
}
