import Koa from "koa";
import { MongoClient } from "mongodb";
import { Container } from "inversify";

import { APP_TYPES, Logger } from "@planv5/application/ports";
import bodyParser from "koa-bodyparser";
import { initInjection } from "../injection/configureInjectionForServer";
import { configureAppRoute } from "./routes/app";
import { configureDataApi } from "./routes/socketApi";
import { configureStaticsRoute } from "./routes/statics";
import { auth } from "./routes/auth";
import { prepareHttpRequest } from "./middleware/http";
import * as HANDLERS from "@planv5/application/handlers";

export const configureServer = async (
  enableHotModuleReloading: boolean,
  container: Container,
  client?: MongoClient
): Promise<Koa> => {
  const logger = container.get<Logger>(APP_TYPES.Logger);
  logger.info("Starting application!");
  logger.info("Configuring application bindings");
  await initInjection(container, client);

  const app = new Koa();

  app.use(bodyParser());
  app.use(prepareHttpRequest(container));
  app.use(auth(logger, HANDLERS));
  app.use(await configureAppRoute(HANDLERS));
  app.use(await configureStaticsRoute(enableHotModuleReloading));

  configureDataApi(app, logger, container, HANDLERS);

  return app;
};
