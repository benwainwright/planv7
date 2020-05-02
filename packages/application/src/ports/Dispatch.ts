import { Command } from "@planv7/domain";

export default interface Dispatch {
  dispatch: (command: Command) => Promise<void>;
}
