import { Book } from "../../book"
import { CtxObserver, Highlighter } from "../../lang/ctx"
import * as Errors from "../../lang/errors"

export abstract class Runner {
  abstract book: Book

  abstract run(
    path: string,
    opts: {
      observers: Array<CtxObserver>
      highlighter: Highlighter
    }
  ): Promise<{ error?: unknown }>

  reporter = new Errors.ErrorReporter()
}
