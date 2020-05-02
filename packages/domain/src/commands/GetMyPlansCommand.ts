import Command from "../ports/Command";

export default class GetMyPlansCommand extends Command {
  public identifier(): string {
    return "GetMyPlansCommand";
  }
}
