import { DomainEvent } from "../domain-event";
import { CommandOutcome } from "../command-outcome";
import { User } from "../entities/user";

export const USER_REGISTERED_EVENT = "UserRegisteredEvent";

export class UserRegisteredEvent extends DomainEvent {
  public getUserMessage(): string | undefined {
    return `User '${this.user.getName()}' successfully registered!`;
  }

  public identifier(): string {
    return USER_REGISTERED_EVENT;
  }

  private readonly user: User;
  public constructor(outcome: CommandOutcome, user: User) {
    super(outcome);
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }

  public toString(): string {
    return `${this.identifier()}(user: ${this.user.toString()})`;
  }
}
