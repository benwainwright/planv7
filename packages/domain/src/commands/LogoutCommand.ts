import Command from "../ports/Command";
import Serialisable from "../ports/Serialisable";

export default class LogoutCommand extends Command implements Serialisable {
  public identifier(): string {
    return "LogoutCommand";
  }
}
