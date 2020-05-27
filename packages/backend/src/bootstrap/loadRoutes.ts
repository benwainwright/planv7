import * as routes from "../routes";
import { HANDLERS, Logger } from "@planv7/application";
import AppContext from "../AppContext";
import { Container } from "inversify";
import Koa from "koa";

const loadRoutes = async (
  koaApp: Koa<Koa.DefaultState, AppContext>,
  container: Container,
  logger: Logger
): Promise<void> => {
  logger.info("Loading application route");
  koaApp.use(await routes.app(container));

  logger.info("Loading statics route");
  koaApp.use(await routes.statics());

  logger.info("Loading auth route");
  koaApp.use(routes.auth(logger, HANDLERS));
};

export default loadRoutes;
