import type { Configuration } from "webpack";
import Koa from "koa";
import KoaStatic from "koa-static";
import { WEBPACK_WEBSOCKET_PORT } from "../application/constants";
import koaWebpack from "koa-webpack";
import mount from "koa-mount";

const statics = async (): Promise<Koa.Middleware> => {
  if (process.env.HOT_RELOADING) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    /* eslint-disable @typescript-eslint/no-var-requires */
    const config: Configuration = require("../../webpack/webpack.config.hmr");
    /* eslint-enable @typescript-eslint/no-var-requires */
    /* eslint-enable @typescript-eslint/no-require-imports */

    const hotClient = {
      host: "0.0.0.0",
      allEntries: true,
      port: WEBPACK_WEBSOCKET_PORT,
    };

    return koaWebpack({ config, hotClient });
  } else {
    const assetsDir = process.env.ASSETS_DIR ?? "./dist/assets";

    // eslint-disable-next-line new-cap
    return mount("/assets", KoaStatic(assetsDir));
  }
};

export default statics;
