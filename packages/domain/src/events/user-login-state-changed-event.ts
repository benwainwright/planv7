import CommandOutcome from "../CommandOutcome";
import DomainEvent from "../DomainEvent";
import User from "../entities/User";

export const USER_LOGIN_STATE_CHANGE_EVENT = "UserLoginStateChangeEvent";

export class UserLoginStateChangeEvent extends DomainEvent {
  public getUserMessage(): string {
    if (this.user) {
      return `User '${this.user.getName()}' logged in`;
    } else {
      return "User logged out";
    }
  }

  public identifier(): string {
    return USER_LOGIN_STATE_CHANGE_EVENT;
  }
  private readonly user: User | null;
  public constructor(outcome: CommandOutcome, user: User | null) {
    super(outcome);
    this.user = user;
  }

  public getUser(): User | null {
    return this.user;
  }

  public toString(): string {
    const username = this.user ? this.user.toString() : "";
    return `${this.identifier()}(user: ${username})`;
  }
}
