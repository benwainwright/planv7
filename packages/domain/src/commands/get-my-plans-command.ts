import { Command } from "../ports/command";

export class GetMyPlansCommand extends Command {
  public identifier(): string {
    return "GetMyPlansCommand";
  }
}
