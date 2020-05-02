import Command from "../ports/Command";

export default class GetAllUsersCommand extends Command {
  public identifier(): string {
    return "GetAllUsersCommand";
  }
}
