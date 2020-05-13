import { TYPES as APP, Logger } from "@planv7/application";
import { WinstonConfig, WinstonLogger } from "@planv7/framework";
import { format, transports } from "winston";
import { Container } from "inversify";

const initialiseLogger = (container: Container): Logger => {
  const loggingFormat =
    process.env.NODE_ENV !== "production"
      ? format.combine(format.timestamp(), format.colorize())
      : format.combine(format.simple());

  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL ?? "info", [
    new transports.Console({
      format: loggingFormat,
    }),
  ]);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);
  container.bind<Logger>(APP.logger).to(WinstonLogger);
  return container.get<Logger>(APP.logger);
};

export default initialiseLogger;
