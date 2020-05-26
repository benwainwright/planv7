import { TYPES as APP, Logger } from "@planv7/application";
import BrowserConsole from "winston-transport-browserconsole";
import { WinstonConfig, WinstonLogger } from "@planv7/framework";
import { format } from "winston";
import { Container } from "inversify";

const initialiseLogger = (container: Container): Logger => {
  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL ?? "info", [
    new BrowserConsole({
      format: format.simple(),
    }),
  ]);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);
  container.bind<Logger>(APP.logger).to(WinstonLogger);
  return container.get<Logger>(APP.logger);
};

export default initialiseLogger;
