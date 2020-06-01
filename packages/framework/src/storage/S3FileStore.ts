import "reflect-metadata";
import * as nodePath from "path";
import { inject, injectable } from "inversify";
import { FileStore } from "@choirpractise/application";
import TYPES from "../TYPES";
import axios from "axios";

@injectable()
export default class S3FileStore implements FileStore {
  private readonly endpoint: string;

  public constructor(@inject(TYPES.filesEndpoint) endpoint: string) {
    this.endpoint = endpoint;
  }



  public async saveFile(file: File, path: string): Promise<void> {
    const contentType = !file.type ? "text/plain" : file.type;
    const response = await axios({
      method: "POST",
      url: this.endpoint,
      data: { path: nodePath.join(path, file.name), contentType },
    });

    await axios({
      method: "PUT",
      url: response.data.url,
      data: file,
      headers: {
        "content-type": contentType
      },
    });
  }
}
