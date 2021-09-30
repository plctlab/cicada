export abstract class Resource<T> {
  abstract keys(): Promise<Array<string>>
  abstract get_or_fail(key: string): Promise<T>
  abstract all(): Promise<Record<string, T>>
}

export abstract class FileResource extends Resource<string> {
  abstract keys(): Promise<Array<string>>
  abstract get_or_fail(key: string): Promise<string>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.get_or_fail(path)
    }

    return files
  }
}
