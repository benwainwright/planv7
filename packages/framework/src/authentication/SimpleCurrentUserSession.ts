import { User } from "@planv7/domain";
import { CurrentLoginSession } from "@planv7/application";

export default class SimpleCurrentUserSession implements CurrentLoginSession {
  private user: User;

  public constructor(user: User) {
    this.user = user;
  }

  public getCurrentUser(): User | null {
    return this.user;
  }

  public setCurrentUser(user: User): void {
    this.user = user;
  }
}
