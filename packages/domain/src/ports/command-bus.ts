import { Command } from "./command";

export interface CommandBus {
  execute: <C extends Command>(command: C) => Promise<void>;
}
