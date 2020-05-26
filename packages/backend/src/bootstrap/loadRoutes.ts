import * as routes from "../routes";
import { Container } from "inversify";
import Koa from "koa";
import { Logger } from "@planv7/application";

const loadRoutes = async (
  koaApp: Koa,
  container: Container,
  logger: Logger
): Promise<void> => {
  logger.info("Loading application route");
  koaApp.use(await routes.app(container));

  logger.info("Loading statics route");
  koaApp.use(await routes.statics());
};

export default loadRoutes;
