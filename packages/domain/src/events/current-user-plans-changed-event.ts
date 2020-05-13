import CommandOutcome from "../CommandOutcome";
import DomainEvent from "../DomainEvent";
import Plan from "../entities/Plan";

export const CURRENT_USER_PLANS_CHANGED_EVENT = "CurrentUserPlansChangedEvent";

export class CurrentUserPlansChangedEvent extends DomainEvent {
  private readonly plans: Plan[];

  public getUserMessage(): string {
    return "Plans updated";
  }

  public constructor(outcome: CommandOutcome, plans?: Plan[]) {
    super(outcome);
    this.plans = plans ?? [];
  }

  public getPlans(): Plan[] {
    return this.plans;
  }

  public identifier(): string {
    return CURRENT_USER_PLANS_CHANGED_EVENT;
  }
}
