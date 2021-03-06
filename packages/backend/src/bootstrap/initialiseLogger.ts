import * as constants from "../constants";
import { TYPES as APP, Logger } from "@choirpractise/application";
import { WinstonConfig, WinstonLogger } from "@choirpractise/framework";
import { format, transports } from "winston";
import { Container } from "inversify";

const initialiseLogger = (container: Container): Logger => {
  const loggingFolder = process.env.LOG_DIR ?? `/var/log/${constants.APP_NAME}/`;
  const transportConfig =
    process.env.NODE_ENV === "production"
      ? [
          new transports.Console({
            format: format.simple(),
          }),
          new transports.File({
            filename: `${loggingFolder}/app.log`,
          }),
        ]
      : [
          new transports.Console({
            format: format.colorize(),
          }),
        ];

  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL ?? "info", transportConfig);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);
  container.bind<Logger>(APP.logger).to(WinstonLogger).inSingletonScope();
  return container.get<Logger>(APP.logger);
};

export default initialiseLogger;
