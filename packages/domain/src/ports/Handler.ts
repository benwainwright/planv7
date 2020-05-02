import Command from "./Command";

export default interface Handler<T extends Command> {
  getCommandInstance: () => T;
  tryHandle: (command: T) => Promise<void>;
}
