import { Command } from "./command";

export interface Handler<T extends Command> {
  getCommandInstance: () => T;
  tryHandle: (command: T) => Promise<void>;
}
