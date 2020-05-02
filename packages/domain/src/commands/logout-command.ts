import { Serializable } from "../ports/serializable";
import { Command } from "../ports/command";

export class LogoutCommand extends Command implements Serializable {
  public identifier(): string {
    return "LogoutCommand";
  }
}
