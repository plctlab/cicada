import { Ctx } from "../ctx"
import { Core } from "../core"
import { Value } from "../value"
import pt from "@cicada-lang/partech"

export interface ExpMeta {
  span?: pt.Span
}

export interface ElaborationOptions {
  narrate_elaboration_p?: boolean
}

export abstract class Exp {
  meta?: ExpMeta

  abstract free_names(bound_names: Set<string>): Set<string>
  abstract subst(name: string, exp: Exp): Exp
  abstract format(): string

  check?(ctx: Ctx, t: Value, opts?: ElaborationOptions): Core
  infer?(ctx: Ctx, opts?: ElaborationOptions): { t: Value; core: Core }

  // TODO should be removed after improving syntax
  is_sequence: boolean = false
}
