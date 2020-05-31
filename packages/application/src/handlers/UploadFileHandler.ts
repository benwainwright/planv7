import HandlerBase from "../core/HandlerBase";
import { UploadFileCommand } from "@choirpractise/domain";

export default class UploadFileHandler extends HandlerBase<UploadFileCommand> {

  public getCommandInstance(): UploadFileCommand {
    return new UploadFileCommand();
  }

  protected async execute(command: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
