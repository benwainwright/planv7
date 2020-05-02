import { CommandOutcome } from "./command-outcome";
import { Serializable } from "./ports/serializable";

export abstract class DomainEvent implements Serializable {
  public abstract identifier(): string;

  public abstract getUserMessage(): string | undefined;

  private outcome: CommandOutcome;

  public constructor();
  public constructor(outcome: CommandOutcome);
  public constructor(outcome?: CommandOutcome) {
    this.outcome = outcome || CommandOutcome.SUCCESS;
  }

  public getOutcome(): CommandOutcome {
    return this.outcome;
  }
}
