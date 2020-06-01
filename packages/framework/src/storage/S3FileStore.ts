import "reflect-metadata";
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
    console.log(file.type)
    const response = await axios({
      method: "POST",
      url: this.endpoint,
      data: { path, contentType: file.type },
    });

    await axios({
      method: "PUT",
      url: response.data.url,
      data: file,
      headers: {
        "content-type": file.type,
      },
    });
  }
}
