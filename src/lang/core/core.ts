import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export abstract class Core {
  instanceofCore = true

  abstract evaluate(env: Env): Value
  abstract format(): string
  abstract alpha_format(ctx: AlphaCtx): string

  // TODO should be removed after improving syntax
  is_sequence: boolean = false
}

export class AlphaCtx {
  names: Array<string>

  constructor(names: Array<string> = new Array()) {
    this.names = names
  }

  get depth(): number {
    return this.names.length
  }

  find_depth(name: string): number | undefined {
    const index = this.names.lastIndexOf(name)
    if (index === -1) {
      return undefined
    } else {
      return index
    }
  }

  extend(name: string): AlphaCtx {
    return new AlphaCtx([...this.names, name])
  }
}
