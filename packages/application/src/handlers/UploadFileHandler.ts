import { inject, injectable } from "inversify";
import FileStore from "../ports/FileStore";
import HandlerBase from "../core/HandlerBase";
import TYPES from "../ports/TYPES";
import { UploadFileCommand } from "@choirpractise/domain";

@injectable()
export default class UploadFileHandler extends HandlerBase<UploadFileCommand> {
  private readonly fileStore: FileStore;

  public constructor(@inject(TYPES.fileStore) fileStore: FileStore) {
    super();
    this.fileStore = fileStore;
  }

  public getCommandInstance(): UploadFileCommand {
    return new UploadFileCommand();
  }

  protected async execute(command: UploadFileCommand): Promise<void> {
    if (command.file && command.path) {
      await this.fileStore.saveFile(command.file, command.path);
    }
  }
}
