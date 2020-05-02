import Command from "../ports/Command";
import Serialisable from "../ports/Serialisable";

export default class LoginCommand extends Command implements Serialisable {
  private readonly username: string;
  private readonly password: string;

  public constructor();
  public constructor(username: string, password: string);
  public constructor(username?: string, password?: string) {
    super();
    this.username = username || "";
    this.password = password || "";
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): string {
    return this.password;
  }

  public identifier(): string {
    return "LoginCommand";
  }
}
