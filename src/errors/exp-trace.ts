import { Exp } from "../exp"

export class ExpTrace extends Error {
  message: string
  previous: Array<Exp> = []

  constructor(message: string) {
    super()
    this.message = message
  }

  trail(x: Exp): this {
    this.previous.push(x)
    return this
  }

  report(opts: { text?: string }): string {
    const { text } = opts

    if (text === undefined) {
      let s = ""
      s += this.message
      s += "\n"

      if (this.previous.length > 0) {
        s += "\n"
        s += "previous:\n"
        for (const x of this.previous) {
          s += `- ${x.repr()}\n`
        }
      }

      return s
    } else {
      let s = ""
      s += this.message
      s += "\n"

      if (this.previous.length > 0) {
        s += "\n"
        s += "previous:\n"
        for (const x of this.previous) {
          s += `- ${x.repr()}\n`
        }
      }

      return s
    }
  }
}
