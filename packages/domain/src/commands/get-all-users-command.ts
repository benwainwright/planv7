import { Command } from "../ports/command";

export class GetAllUsersCommand extends Command {
  public identifier(): string {
    return "GetAllUsersCommand";
  }
}
