import { CommandOutcome } from "../command-outcome";
import { DomainEvent } from "../domain-event";
import { Plan } from "../entities/plan";

export const CURRENT_USER_PLANS_CHANGED_EVENT = "CurrentUserPlansChangedEvent";

export class CurrentUserPlansChangedEvent extends DomainEvent {
  public getUserMessage(): string | undefined {
    return undefined;
  }

  private readonly plans: Plan[];

  public constructor(outcome: CommandOutcome, plans?: Plan[]) {
    super(outcome);
    this.plans = plans || [];
  }

  public getPlans(): Plan[] {
    return this.plans;
  }

  public identifier(): string {
    return CURRENT_USER_PLANS_CHANGED_EVENT;
  }
}
