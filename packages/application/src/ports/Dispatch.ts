import { Command } from "@choirpractise/domain";

export default interface Dispatch {
  dispatch: (command: Command) => Promise<void>;
}
