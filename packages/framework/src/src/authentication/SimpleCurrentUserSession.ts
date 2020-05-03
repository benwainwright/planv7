import { User } from "@planv5/domain";
import { CurrentLoginSession } from "@planv5/application/ports";

export class SimpleCurrentUserSession implements CurrentLoginSession {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  public async getCurrentUser(): Promise<User> {
    return this.user;
  }

  public setCurrentUser(user: User): void {
    this.user = user;
  }
}
