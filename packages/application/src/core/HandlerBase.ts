import "reflect-metadata";
import { Command, Handler } from "@choirpractise/domain";
import { injectable } from "inversify";

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
