import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import Path from "path"
import app from "../../app/node-app"
import { LocalRunner } from "../runners/local-runner"

type Args = { article: string }

export class SnapshotCommand extends Command<Args> {
  name = "snapshot"

  description = "Take a snapshot of an article"

  args = { article: ty.string() }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command take a snapshot of an article,`,
      `recording its results into an output file,`,
      `named after the article plus ${blue(".out")}`,
      ``,
      `It supports ${blue(".md")} and ${blue(".cic")} file extensions.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args): Promise<void> {
    Command.assertFile(argv["article"])
    const book = await app.localBooks.findUpOrFake(
      Path.dirname(argv["article"])
    )
    const path = Path.resolve(argv["article"])
    const runner = new LocalRunner()
    const { error } = await runner.run(book, path, {
      observers: app.defaultCtxObservers,
      highlighter: app.defaultHighlighter,
    })
    if (error) {
      process.exit(1)
    }
  }
}
