// Import http from "http";
import { format, transports } from "winston";
import { Container } from "inversify";
import { WinstonConfig, WinstonLogger } from "@planv5/framework";
import { APP_TYPES, Logger } from "@planv5/application/ports";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { configureServer } from "./server";
// Import { koaWebpackMiddleware } from "./routes/statics";
import { DEFAULT_SERVER_PORT, PRODUCTION_MODE_STRING } from "./constants";

const configureLogging = (container: Container): Logger => {
  let loggingFormat;

  if (process.env.NODE_ENV !== "production") {
    loggingFormat = format.combine(format.simple(), format.colorize());
  } else {
    loggingFormat = format.combine(format.timestamp());
  }

  const loggingConfig = new WinstonConfig(process.env.APP_LOG_LEVEL || "info", [
    new transports.Console({
      format: loggingFormat
    })
  ]);

  container.bind<WinstonConfig>(WinstonConfig).toConstantValue(loggingConfig);
  container
    .bind<Logger>(APP_TYPES.Logger)
    .to(WinstonLogger)
    .inSingletonScope();
  return container.get<Logger>(APP_TYPES.Logger);
};

const run = async (container: Container, logger: Logger): Promise<void> => {
  let mongoClient: MongoClient | undefined;

  if (process.env.USE_MONGO_MEMORY_SERVER) {
    const server = new MongoMemoryServer();
    const uri = await server.getConnectionString();
    mongoClient = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  const port = process.env.SERVER_PORT || DEFAULT_SERVER_PORT;
  const hmr = process.env.NODE_ENV !== PRODUCTION_MODE_STRING;
  const app = await configureServer(hmr, container, mongoClient);
  app.listen(port, () => logger.info(`Listening on port ${port}`));
  // Let currentApp = app.callback();
  // const server = http.createServer(currentApp);

  // // @ts-ignore
  // if (module.hot) {
  //   // @ts-ignore
  //   module.hot.accept("./server", async () => {
  //     server.removeListener("request", currentApp);
  //     await new Promise(accept => koaWebpackMiddleware.close(accept));
  //     const container = new Container();
  //     configureLogging(container);
  //     currentApp = (await configureServer(hmr, container)).callback();
  //     server.on("request", currentApp);
  //   });
  // }
};

const container = new Container();
const logger = configureLogging(container);
try {
  run(container, logger);
} catch (error) {
  logger.error(`Failed to initialise server: ${error}`);
}
