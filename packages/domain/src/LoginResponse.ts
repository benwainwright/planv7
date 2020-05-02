import Response from "./Response";
import User from "./entities/User";

export default class LoginResponse implements Response {
  private readonly user?: User;

  public constructor(user?: User) {
    this.user = user;
  }

  public getUser(): User | undefined {
    return this.user;
  }
}
