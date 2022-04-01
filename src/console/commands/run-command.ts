import { Command } from "@enchanterjs/enchanter/lib/command"
import { CommandRunner } from "@enchanterjs/enchanter/lib/command-runner"
import ty from "@xieyuheng/ty"
import fs from "fs"
import watcher from "node-watch"
import Path from "path"
import app from "../../app/node-app"
import { ModLoader } from "../../lang/mod"
import { Runner } from "../runner"

type Args = { article: string }
type Opts = { watch?: boolean }

export class RunCommand extends Command<Args, Opts> {
  name = "run"

  description = "Run through an article"

  args = { article: ty.string() }
  opts = { watch: ty.optional(ty.boolean()) }

  loader = new ModLoader()

  constructor() {
    super()
    this.loader.fetcher.register("file", (url) =>
      fs.promises.readFile(url.pathname, "utf8")
    )
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command runs through an article,`,
      `evaluating top-level expressions, and prints the results.`,
      ``,
      `It supports ${blue(".md")} and ${blue(".cic")} file extensions.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
      `We can also run a URL directly.`,
      ``,
      blue(`  ${runner.name} ${this.name} "https://cdn.jsdelivr.net/gh/xieyuheng/the-little-typer-exercises@0.0.2/src/02.md"`),
      ``,
      `You can use ${blue("--watch")} to let the program stand by, and react to changes.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const runner = new Runner()
    const url = createURL(argv["article"])
    if (argv["watch"]) {
      await runner.run(url)

      if (url.protocol === "file:") {
        app.logger.info(`Initial run complete, now watching for changes.`)
        await this.watch(runner, url.pathname)
      } else {
        app.logger.info(`Can not watch non-local file.`)
      }
    } else {
      const { error } = await runner.run(url)
      if (error) {
        process.exit(1)
      }
    }
  }

  async watch(runner: Runner, path: string): Promise<void> {
    watcher(path, async (event, file) => {
      const url = new URL(`file:${path}`)

      if (event === "remove") {
        this.loader.cache.delete(url.href)
        app.logger.info({ tag: event, msg: path })
        process.exit(1)
      }

      if (event === "update") {
        this.loader.cache.delete(url.href)
        const { error } = await runner.run(url)

        if (error) {
          app.logger.error({ tag: event, msg: path })
        } else {
          app.logger.info({ tag: event, msg: path })
        }
      }
    })
  }
}

function createURL(path: string): URL {
  if (ty.uri().isValid(path)) {
    return new URL(path)
  }

  if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    const fullPath = Path.resolve(path)
    return new URL(`file:${fullPath}`)
  }

  throw new Error(`I can not create URL from path: ${path}`)
}
