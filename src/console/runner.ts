import Path from "path"
import { StmtOutput } from "src/lang/stmt"
import * as Errors from "../lang/errors"
import { ModLoader } from "../lang/mod"
import { readURL } from "../ut/node/url"

export class Runner {
  reporter = new Errors.ErrorReporter()
  loader = new ModLoader()

  async run(
    url: URL,
    opts?: { silent?: boolean }
  ): Promise<{ error?: unknown }> {
    try {
      const mod = await this.loader.load(url, {
        fileFetcher: { fetch: readURL },
      })

      await mod.runAll()

      const output = mod.blocks.allOutputs
        .filter((output) => output !== undefined)
        .map((output) => (output as StmtOutput).formatForConsole())
        .join("\n")

      if (output && !opts?.silent) {
        console.log(output)
      }

      return { error: undefined }
    } catch (error) {
      const path = Path.relative(process.cwd(), url.pathname)
      const text = await readURL(url)
      const report = this.reporter.report(error, { path, text })

      if (!opts?.silent) {
        console.error(report)
      }

      return { error }
    }
  }
}
