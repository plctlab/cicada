import * as Closure from "../closure"
import * as Evaluate from "../../evaluate"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Exp from "../../exp"
import * as Env from "../../env"
import * as Mod from "../../mod"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  const env = Pattern.match(closure.env, closure.pattern, value)
  if (env === undefined)
    throw new Trace.Trace(
      ut.aline(`
        |Closure.apply -- pattern mismatch.
        |- value.kind: ${value.kind}
        |`)
    )
  return Evaluate.evaluate(closure.mod, env, closure.ret)
}
