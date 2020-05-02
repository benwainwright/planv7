import Serialisable from "./Serialisable";

export default abstract class Command implements Serialisable {
  protected handled?: boolean = false;

  public abstract identifier(): string;

  public shouldContinueHandling(): boolean {
    return !this.handled;
  }

  public markHandlingComplete(): void {
    this.handled = true;
  }

  public markHandlingIncomplete(): void {
    this.handled = false;
  }

  public toString(): string {
    return this.identifier();
  }
}
