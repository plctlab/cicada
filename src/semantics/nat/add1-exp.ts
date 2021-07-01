import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { Value } from "../../value"
import { nat_to_number } from "./nat-util"
import * as Sem from "../../sem"

export class Add1 extends Exp {
  prev: Exp

  constructor(prev: Exp) {
    super()
    this.prev = prev
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.prev.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Add1(this.prev.subst(name, exp))
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Sem.NatValue(),
      core: new Sem.Add1(check(ctx, this.prev, new Sem.NatValue())),
    }
  }

  repr(): string {
    const n = nat_to_number(this)
    if (n !== undefined) {
      return n.toString()
    } else {
      return `add1(${this.prev.repr()})`
    }
  }
}
