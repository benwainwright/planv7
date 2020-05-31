import { FileStore } from "@choirpractise/application";

export default class S3FileStore implements FileStore {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/require-await */
  public async saveFile(file: File, path: string): Promise<void> {
    throw new Error("Not yet implemented");

  }
}
