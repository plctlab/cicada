import { evaluator } from "../evaluator"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Exp from "../exp"
import * as Evaluate from "../evaluate"

export function execute(mod: Mod.Mod, env: Env.Env, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      Env.update(env, stmt.name, evaluator.evaluate(stmt.exp, { mod, env }))
    }
  }
}
