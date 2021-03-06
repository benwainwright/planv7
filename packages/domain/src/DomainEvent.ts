import CommandOutcome from "./CommandOutcome";
import Serialisable from "./ports/Serialisable";

export default abstract class DomainEvent implements Serialisable {
  public abstract identifier(): string;

  public abstract getUserMessage(): string | undefined;

  private outcome: CommandOutcome;

  public constructor(outcome?: CommandOutcome) {
    this.outcome = outcome ?? CommandOutcome.SUCCESS;
  }

  public getOutcome(): CommandOutcome {
    return this.outcome;
  }
}
