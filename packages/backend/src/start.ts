import * as routes from "./routes";

import Koa from "koa";

const SERVER_PORT = 80;

(async (): Promise<void> => {
  const koaApp = new Koa();
  koaApp.use(await routes.app());
  koaApp.use(await routes.statics());
  koaApp.listen(SERVER_PORT);
})();
