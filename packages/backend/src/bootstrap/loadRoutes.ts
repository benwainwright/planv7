import * as routes from "../routes";
import Koa from "koa";
import { Logger } from "@planv7/application";

const loadRoutes = async (koaApp: Koa, logger: Logger): Promise<void> => {
  logger.info("Loading application route");
  koaApp.use(await routes.app());

  logger.info("Loading statics route");
  koaApp.use(await routes.statics());
};

export default loadRoutes;
