import { Library } from "../../library"
import { FileResource } from "../../library/file-resource"
import { Logger } from "../logger"
import { Runner } from "../runner"

export class DefaultRunner extends Runner {
  library: Library
  files: FileResource
  logger?: Logger

  constructor(opts: {
    library: Library
    files: FileResource
    logger?: Logger
  }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.load(path)
      if (this.logger) {
        this.logger.info(path)
      }
      if (mod.all_output) {
        console.log(mod.all_output)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.reporter.error(error, path)
      console.error(report)
      if (this.logger) {
        this.logger.error(path)
      }
      return { error }
    }
  }
}
