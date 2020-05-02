import { Command } from "@planv5/domain/ports";
export default interface Dispatch {
  dispatch: (command: Command) => Promise<void>;
}
