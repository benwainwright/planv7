import CommandOutcome from "./CommandOutcome";
import Serializable from "./ports/Serializable";

export default abstract class DomainEvent implements Serializable {
  public abstract identifier(): string;

  public abstract getUserMessage(): string | undefined;

  private outcome: CommandOutcome;

  public constructor(outcome?: CommandOutcome) {
    this.outcome = outcome || CommandOutcome.SUCCESS;
  }

  public getOutcome(): CommandOutcome {
    return this.outcome;
  }
}
