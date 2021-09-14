import { Library } from "../../library"
import { FileAdapter } from "../../library/file-adapter"
import { Logger } from "../logger"
import { ModuleRunner } from "../module-runner"

export class DefaultModuleRunner extends ModuleRunner {
  library: Library
  files: FileAdapter
  logger?: Logger

  constructor(opts: { library: Library; files: FileAdapter; logger?: Logger }) {
    super()
    this.library = opts.library
    this.files = opts.files
    this.logger = opts.logger
  }

  async run(path: string): Promise<{ error?: unknown }> {
    try {
      const mod = await this.library.mods.load(path)
      if (this.logger) {
        this.logger.info(path)
      }
      return { error: undefined }
    } catch (error) {
      const report = await this.library.error_report(error, path)
      console.error(report)
      if (this.logger) {
        this.logger.error(path)
      }
      return { error }
    }
  }
}
