import { GitLink } from "@enchanterjs/enchanter/lib/git-link"
import axios from "axios"
import contentDisposition from "content-disposition"
import JSZip from "jszip"

export type GitHubZipResult = {
  link: GitLink
  zip: JSZip
}

export class GitHubZipDownloader {
  // NOTE Example targets:
  // - github.com/xieyuheng/mathematical-structures@0.0.1
  async download(target: string): Promise<GitHubZipResult> {
    const link = GitLink.decode(target)

    if (link.host !== "github.com") {
      throw new Error(`I expect host to be github.com`)
    }

    const zipUrl = this.formatZipUrl(link)

    const { data, headers } = await axios.get(zipUrl, {
      responseType: "arraybuffer",
    })

    const { parameters } = contentDisposition.parse(
      headers["content-disposition"]
    )

    let zip: null | JSZip = await JSZip.loadAsync(data)
    zip = zip?.folder(parameters.filename)
    if (zip === null) {
      throw new Error(`fail to load zip`)
    }

    return {
      link,
      zip,
    }
  }

  private formatZipUrl(opts: { repo: string; tag: string }): string {
    const { repo, tag } = opts
    return `https://github.com/${repo}/archive/refs/tags/${tag}.zip`
  }
}
