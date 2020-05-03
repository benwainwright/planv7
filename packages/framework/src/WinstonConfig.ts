import * as Transport from "winston-transport";

export default class WinstonConfig {
  public readonly level: string;
  public readonly transports: Transport[];

  public constructor(level: string, transports: Transport[]) {
    this.level = level;
    this.transports = transports;
  }
}
