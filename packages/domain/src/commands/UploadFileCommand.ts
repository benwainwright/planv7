import Command from "../ports/Command"

export default class UploadFileCommand extends Command {

  public identifier(): string {
    return "UploadFileCommand"
  }

  public readonly file?: File;
  public readonly path?: string;

  public constructor(file?: File, path?: string) {
    super();
    this.file = file;
    this.path = path;
  }
}
