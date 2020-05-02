import { DomainEvent } from "../domain-event";
import { CommandOutcome } from "../command-outcome";
import { User } from "../entities/user";

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
  private readonly user: User | undefined;
  public constructor(outcome: CommandOutcome, user?: User) {
    super(outcome);
    this.user = user;
  }

  public getUser(): User | undefined {
    return this.user;
  }

  public toString(): string {
    const username = this.user !== undefined ? this.user.toString() : "";
    return `${this.identifier()}(user: ${username})`;
  }
}
