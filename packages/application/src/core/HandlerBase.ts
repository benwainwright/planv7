import "reflect-metadata";
import { injectable } from "inversify";
import { Command, Handler } from "@planv7/domain";

@injectable()
export default abstract class HandlerBase<T extends Command>
  implements Handler<T> {
  public async tryHandle(command: T): Promise<void> {
    if (command.identifier() === this.getCommandInstance().identifier()) {
      command.markHandlingComplete();
      await this.execute(command);
    }
  }

  public abstract getCommandInstance(): T;
  protected abstract execute(command: T): Promise<void>;
}
