import { Command } from "../command"
import { Library } from "../../library"
import { LocalFileStore } from "../../file-stores"
import { FakeFileStore } from "../../file-stores"
import * as Runners from "../../runners"
import find_up from "find-up"
import Path from "path"
import fs from "fs"
import { ReplCommand } from "./repl"

type Argv = {
  file?: string
}

export class RunCommand extends Command<Argv> {
  signature = "run [file]"
  description = "Run a file -- support .md or .cic"

  async execute(argv: Argv): Promise<void> {
    if (argv["file"] === undefined) {
      const command = new ReplCommand()
      await command.execute({ dir: process.cwd() })
      return
    }

    if (!fs.existsSync(argv["file"])) {
      console.error(`The given file does not exist: ${argv["file"]}`)
      process.exit(1)
    }

    if (!fs.lstatSync(argv["file"]).isFile()) {
      console.error(`The given path does not refer to a file: ${argv["file"]}`)
      process.exit(1)
    }

    const path = Path.resolve(argv["file"])
    const dir = Path.dirname(path)
    const config_file = await find_up("library.json", { cwd: dir })

    const config = config_file
      ? Library.config_schema.validate(
          JSON.parse(await fs.promises.readFile(config_file, "utf8"))
        )
      : Library.fake_config()
    const files = config_file
      ? new LocalFileStore({ dir })
      : new FakeFileStore({ dir })
    const library = new Library({ config, files })
    const runner = new Runners.DefaultRunner({ library, files })

    const { error } = await runner.run(path)
    if (error) {
      process.exit(1)
    }
  }
}
