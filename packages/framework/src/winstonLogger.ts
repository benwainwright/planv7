import * as Transport from "winston-transport";
import { Logger as Winston, createLogger } from "winston";
import { inject, injectable } from "inversify";

import { Logger } from "@planv5/application/ports";

export class WinstonConfig {
  public readonly level: string;
  public readonly transports: Transport[];

  public constructor(level: string, transports: Transport[]) {
    this.level = level;
    this.transports = transports;
  }
}

@injectable()
export class WinstonLogger implements Logger {
  private readonly logger: Winston;

  public constructor(@inject(WinstonConfig) config: WinstonConfig) {
    this.logger = createLogger({
      level: config.level
    });

    for (const transport of config.transports) {
      this.logger.add(transport);
    }
  }

  public log(level: string, message: string): void {
    this.logger.log(level, message);
  }

  public error(message: string): void {
    this.logger.log("error", message);
  }

  public warning(message: string): void {
    this.logger.log("warn", message);
  }

  public info(message: string): void {
    this.logger.log("info", message);
  }

  public debug(message: string): void {
    this.logger.log("debug", message);
  }

  public verbose(message: string): void {
    this.logger.log("verbose", message);
  }
}