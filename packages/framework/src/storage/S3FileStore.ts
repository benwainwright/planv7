import { FileStore } from "@choirpractise/application";
import axios from "axios";

export default class S3FileStore implements FileStore {
  private readonly endpoint: string;

  public constructor(endpoint: string) {
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
