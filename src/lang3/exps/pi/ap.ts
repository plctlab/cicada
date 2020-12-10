import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import { ap_evaluable } from "./ap-evaluable"

export type Ap = Evaluable &
  Repr & {
    kind: "Exp.ap"
    target: Exp
    arg: Exp
  }

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
    ...ap_evaluable(target, arg),
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}
