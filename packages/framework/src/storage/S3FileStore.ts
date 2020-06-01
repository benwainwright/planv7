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
    const response = await axios({
      method: "POST",
      url: this.endpoint,
      data: { path },
    });

    const { url } = JSON.parse(response.data);
    const data = new FormData();
    data.append("file", file);

    await axios({
      method: "POST",
      url,
      data,
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  }
}
