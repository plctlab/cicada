import * as Pattern from "../pattern"
import * as Value from "../value"
import * as Env from "../env"
import * as ut from "../../ut"

export function match(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value
): undefined | Env.Env {
  return match_pattern(env, pattern, value, new Map())
}

// NOTE side effect on `matched`
function match_pattern(
  env: Env.Env,
  pattern: Pattern.Pattern,
  value: Value.Value,
  matched: Map<string, Value.Value>
): undefined | Env.Env {
  switch (pattern.kind) {
    case "Pattern.v": {
      const found = matched.get(pattern.name)
      if (found === undefined) {
        matched.set(pattern.name, value)
        return Env.extend(env, pattern.name, value)
      }
      // NOTE not `Value.conversion()` because we do not have `ctx`
      if (ut.equal(found, value)) return env
      return undefined
    }
    case "Pattern.datatype": {
      if (
        value.kind === "Value.datatype" &&
        value.type_constructor.name === pattern.name
      ) {
        return match_patterns(env, pattern.args, value.args, matched)
      }
      return undefined
    }
    case "Pattern.data": {
      if (
        value.kind === "Value.data" &&
        value.data_constructor.type_constructor.name === pattern.name &&
        value.data_constructor.tag === pattern.tag
      ) {
        return match_patterns(env, pattern.args, value.args, matched)
      }
      return undefined
    }
  }
}

// NOTE side effect on `matched`
function match_patterns(
  env: Env.Env,
  patterns: Array<Pattern.Pattern>,
  values: Array<Value.Value>,
  matched: Map<string, Value.Value>
): undefined | Env.Env {
  if (patterns.length !== values.length) return undefined
  let result: undefined | Env.Env = env
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i]
    const value = values[i]
    result = match_pattern(result, pattern, value, matched)
    if (result === undefined) return undefined
  }
  return result
}
