  /* eslint-disable @typescript-eslint/require-await */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unused-vars */
import FileStore from "../ports/FileStore";
import HandlerBase from "../core/HandlerBase";
import { UploadFileCommand } from "@choirpractise/domain";

export default class UploadFileHandler extends HandlerBase<UploadFileCommand> {
  private readonly fileStore: FileStore

  public constructor(fileStore: FileStore) {
    super();
    this.fileStore = fileStore;
  }

  public getCommandInstance(): UploadFileCommand {
    return new UploadFileCommand();
  }

  protected async execute(command: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
