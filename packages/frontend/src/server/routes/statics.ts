import koaWebpack from "koa-webpack";
import koa from "koa";
import compose from "koa-compose";
import webpack from "webpack";
import mount from "koa-mount";
import KoaStatic from "koa-static";
import { WEBPACK_WEBSOCKET_PORT } from "../../constants";

export let koaWebpackMiddleware: any;

export const configureStaticsRoute = async (
  enableHotModuleReloading: boolean
) => {
  const middlewares: koa.Middleware[] = [];
  if (enableHotModuleReloading) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: webpack.Configuration = require("../../../webpack/webpack.client.config.dev");

    const hotClient = {
      host: "0.0.0.0",
      allEntries: true,
      port: WEBPACK_WEBSOCKET_PORT
    };

    koaWebpackMiddleware = await koaWebpack({ config, hotClient });

    middlewares.push(koaWebpackMiddleware);
  }
  middlewares.push(mount("/assets", KoaStatic("./dist/assets/")));
  return compose(middlewares);
};
