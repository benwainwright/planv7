import Command from "../ports/Command";
import Serializable from "../ports/Serializable";

export default class LogoutCommand extends Command implements Serializable {
  public identifier(): string {
    return "LogoutCommand";
  }
}
