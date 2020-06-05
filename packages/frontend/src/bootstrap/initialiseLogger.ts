import { TYPES as APP, Logger } from "@choirpractise/application";
import { WinstonConfig, WinstonLogger } from "@choirpractise/framework";
import BrowserConsole from "winston-transport-browserconsole";
import { Container } from "inversify";
import { format } from "winston";

const initialiseLogger = (container: Container): Logger => {
  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL ?? "info", [
    new BrowserConsole({
      format: format.simple(),
    }),
  ]);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);
  container.bind<Logger>(APP.logger).to(WinstonLogger).inSingletonScope();
  return container.get<Logger>(APP.logger);
};

export default initialiseLogger;
