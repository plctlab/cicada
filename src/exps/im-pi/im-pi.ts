import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

// NOTE We are implementing named argument,
//   thus we can not just use `name`,
//   we need `field_name` and `local_name` just like `Cls`.

export abstract class ImPi extends Exp {
  abstract im_pi_args_repr(): Array<string>
  abstract pi_args_repr(): Array<string>
  abstract pi_ret_t_repr(): string
}
