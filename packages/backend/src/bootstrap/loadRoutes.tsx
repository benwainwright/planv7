import * as routes from "../routes";
import Koa from "koa";

const loadRoutes = async (koaApp: Koa): Promise<void> => {
  koaApp.use(await routes.app());
  koaApp.use(await routes.statics());
};

export default loadRoutes;
