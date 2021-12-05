import { Module } from "../../module"
import { Exp, infer } from "../exp"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class Let extends Stmt {
  meta: StmtMeta
  name: string
  exp: Exp

  constructor(name: string, exp: Exp, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.exp = exp
  }

  async execute(mod: Module): Promise<StmtOutput | undefined> {
    mod.extendInferred(this.name, infer(mod.ctx, this.exp))
    return undefined
  }

  format(): string {
    return `let ${this.name} = ${this.exp.format()}`
  }
}
