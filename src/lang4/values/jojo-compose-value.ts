import { Jo } from "../jo"
import { Value } from "../value"
import { Env } from "../env"
import { Mod } from "../mod"
import { World } from "../world"

export class JoJoComposeValue extends Value {
  array: Array<Jo>
  env: Env
  mod: Mod

  constructor(array: Array<Jo>, the: { env: Env; mod: Mod }) {
    super()
    this.array = array
    this.env = the.env
    this.mod = the.mod
  }

  refer(world: World): World {
    for (const jo of this.array) {
      world = jo.compose(world)
    }
    return world
  }
}
