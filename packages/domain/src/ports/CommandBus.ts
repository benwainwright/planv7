import Command from "./Command";

export default interface CommandBus {
  execute: <C extends Command>(command: C) => Promise<void>;
}
