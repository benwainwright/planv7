import { Response } from "./response";
import { User } from "./entities/user";

export class LoginResponse implements Response {
  private readonly user?: User;

  public constructor();
  public constructor(user: User);
  public constructor(user?: User) {
    this.user = user;
  }

  public getUser(): User | undefined {
    return this.user;
  }
}
