import { Doc } from "../doc"
import { CicDoc, MdDoc } from "../docs"
import { Library, DocBuilder } from "../library"
import { Module } from "../module"

export const doc_builder: DocBuilder<Module> = {
  right_extension_p(path: string): boolean {
    return path.endsWith(".cic") || path.endsWith(".md")
  },

  from_file(opts: {
    path: string
    text: string
    library: Library<Module>
  }): Doc<Module> {
    const { path, text, library } = opts

    if (path.endsWith(".cic")) {
      return new CicDoc({ library, text, path })
    }

    if (path.endsWith(".md")) {
      return new MdDoc({ library, text, path })
    }

    throw new Error(
      `When try to create doc from file, I met path with unknown ext: ${path}`
    )
  },
}
