import { Doc } from "../doc"
import { Library } from "../library"
import { Module } from "../module"
import { Stmt } from "../stmt"
import * as Syntax from "../syntax"

export class CicDoc extends Doc {
  text: string
  path: string

  constructor(opts: { text: string; path: string }) {
    super()
    this.text = opts.text
    this.path = opts.path
  }

  async load(library: Library): Promise<Module> {
    const mod = new Module({ library, path: this.path, text: this.text })
    for (const stmt of this.stmts) {
      await stmt.execute(mod)
    }
    return mod
  }

  private get stmts(): Array<Stmt> {
    return Syntax.parse_stmts(this.text)
  }
}
