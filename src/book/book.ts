import { Module } from "../module"
import * as FileParsers from "./file-parsers"
import { FileStore } from "@xieyuheng/enchanter/lib/file-store"
import ty from "@xieyuheng/ty"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export type BookConfig = {
  title: string
  subtitle?: string
  version: string
  src: string
  authors?: Array<string>
  date?: string
}

const book_config_schema = ty.object<BookConfig>({
  title: ty.string(),
  subtitle: ty.optional(ty.string()),
  version: ty.semver(),
  src: ty.string(),
  authors: ty.optional(ty.array(ty.string())),
  date: ty.optional(ty.string()),
})

export class Book<Files extends FileStore = FileStore> {
  config: BookConfig
  files: Files
  cache: Map<string, Module> = new Map()

  constructor(opts: { config: BookConfig; files: Files }) {
    this.config = opts.config
    this.files = opts.files
  }

  static book_config_schema = book_config_schema

  static fake_config(): BookConfig {
    return book_config_schema.validate({
      title: `<fake-book-${nanoid()}>`,
      version: "0.0.0",
      src: "src",
    })
  }

  async load(path: string): Promise<Module> {
    const cached = this.cache.get(path)
    if (cached) {
      return cached
    }

    const parser = FileParsers.createFileParser(path)
    const text = await this.files.getOrFail(path)
    const stmts = parser.parse_stmts(text)
    const mod = new Module({ book: this, path, stmts })

    this.cache.set(path, mod)
    return mod
  }
}
