import { Command } from "@planv5/domain/ports";
export interface Dispatch {
  dispatch(command: Command): Promise<void>;
}
