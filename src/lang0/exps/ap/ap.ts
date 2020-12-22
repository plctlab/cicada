import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_ap } from "../../evaluate"
import * as Value from "../../value"

export type Ap = Evaluable & {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
    ...Evaluable({
      evaluability: ({ env }) =>
        do_ap(evaluate(env, target), evaluate(env, arg)),
    }),
  }
}
