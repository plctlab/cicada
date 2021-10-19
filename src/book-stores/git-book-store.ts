import { BookStore } from "../book-store"
import { Book } from "../book"
import * as CtxObservers from "../ctx/ctx-observers"
import { CtxObserver, CtxOptions } from "../ctx"
import { GitFileStore } from "@xieyuheng/enchanter/lib/git-file-store"
import { GitPath } from "@xieyuheng/enchanter/lib/git-path"
import * as ut from "../ut"

export class GitBookStore extends BookStore {
  observers: Array<CtxObserver>

  constructor(opts: { observers: Array<CtxObserver> }) {
    super()
    this.observers = opts.observers
  }

  async get(url: string): Promise<Book<GitFileStore>> {
    return this.getFromGitPath(GitPath.fromURL(url))
  }

  async getFromGitPath(gitPath: GitPath): Promise<Book<GitFileStore>> {
    const files = gitPath.createGitFileStore()
    const text = await files.getOrFail("book.json")
    const config = Book.book_config_schema.validate(JSON.parse(text))
    return new Book({
      config,
      files: files.cd(config.src),
      observers: this.observers,
    })
  }
}
