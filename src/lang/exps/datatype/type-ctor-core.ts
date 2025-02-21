import * as ut from "../../../ut"
import { AlphaCtx, Core } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class TypeCtorCore extends Core {
  name: string
  fixed: Record<string, Core>
  varied: Record<string, Core>
  data_ctors: Record<
    string,
    { t: Core; original_bindings: Array<Exps.DataCtorBinding> }
  >

  constructor(
    name: string,
    fixed: Record<string, Core>,
    varied: Record<string, Core>,
    data_ctors: Record<
      string,
      { t: Core; original_bindings: Array<Exps.DataCtorBinding> }
    >
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.varied = varied
    this.data_ctors = data_ctors
  }

  free_names(bound_names: Set<string>): Set<string> {
    const result = this.fixed_free_names(bound_names)

    return new Set([
      ...result.free_names,
      ...this.varied_free_names(result.bound_names),
      ...this.data_ctors_free_names(
        new Set([...result.bound_names, this.name])
      ),
    ])
  }

  private fixed_free_names(bound_names: Set<string>): {
    bound_names: Set<string>
    free_names: Set<string>
  } {
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.fixed)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return { free_names, bound_names }
  }

  private varied_free_names(bound_names: Set<string>): Set<string> {
    // NOTE The `varied` will not be in scope in constructor definitions,
    //   thus we do not need to return new `bound_names`.
    let free_names: Set<string> = new Set()
    for (const [name, exp] of Object.entries(this.varied)) {
      free_names = new Set([...free_names, ...exp.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    return free_names
  }

  private data_ctors_free_names(bound_names: Set<string>): Set<string> {
    let free_names: Set<string> = new Set()
    for (const { t } of Object.values(this.data_ctors)) {
      free_names = new Set([...free_names, ...t.free_names(bound_names)])
    }

    return free_names
  }

  evaluate(env: Env): Value {
    return new Exps.TypeCtorValue(
      this.name,
      this.fixed,
      this.varied,
      this.data_ctors,
      env
    )
  }

  format(): string {
    return this.name
  }

  alpha_format(ctx: AlphaCtx): string {
    const p = this.fixed_alpha_format(ctx)
    const i = this.varied_alpha_format(ctx)
    // NOTE structural typing (do not print `name`)
    const head = `datatype # ${p}${i}`
    const c = this.data_ctors_alpha_format(ctx.extend(this.name))
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private fixed_alpha_format(ctx: AlphaCtx): string {
    if (Object.entries(this.fixed).length > 0) {
      return (
        "(" +
        Object.entries(this.fixed)
          .map(([name, t]) => `${name}: ${t.alpha_format(ctx)}`)
          .join(", ") +
        ") "
      )
    } else if (Object.entries(this.varied).length > 0) {
      return "() "
    } else {
      return ""
    }
  }

  private varied_alpha_format(ctx: AlphaCtx): string {
    if (Object.entries(this.varied).length > 0) {
      return (
        "(" +
        Object.entries(this.varied)
          .map(([name, t]) => `${name}: ${t.alpha_format(ctx)}`)
          .join(", ") +
        ") "
      )
    } else {
      return ""
    }
  }

  private data_ctors_alpha_format(ctx: AlphaCtx): string {
    return Object.entries(this.data_ctors)
      .map(([name, { t }]) => `${name}: ${t.alpha_format(ctx)}`)
      .join("\n")
  }
}
