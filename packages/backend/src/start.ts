import * as routes from "./routes";

import Koa from "koa";

(async (): Promise<void> => {
  const koaApp = new Koa();
  koaApp.use(await routes.app());
})();
