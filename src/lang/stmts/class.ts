import { check } from "../exp"
import * as Exps from "../exps"
import { Mod } from "../mod"
import { Stmt, StmtMeta, StmtOutput } from "../stmt"

export class Class extends Stmt {
  meta: StmtMeta
  name: string
  cls: Exps.Cls

  constructor(name: string, cls: Exps.Cls, meta: StmtMeta) {
    super()
    this.meta = meta
    this.name = name
    this.cls = cls
  }

  async execute(mod: Mod): Promise<StmtOutput | void> {
    const t = new Exps.TypeValue()
    const core = check(mod.ctx, this.cls, t)
    mod.extendTypedCore(this.name, { t, core })
  }

  format(): string {
    return `let ${this.name} = ${this.cls.format()}`
  }
}
