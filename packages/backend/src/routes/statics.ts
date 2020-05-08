import Koa from "koa";
import KoaStatic from "koa-static";
import { WEBPACK_WEBSOCKET_PORT } from "../application/constants";
import koaWebpack from "koa-webpack";
import mount from "koa-mount";
import webpack from "webpack";

const statics = async (): Promise<Koa.Middleware> => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config: webpack.Configuration = require("../../webpack/webpack.config.hmr");

    const hotClient = {
      host: "0.0.0.0",
      allEntries: true,
      port: WEBPACK_WEBSOCKET_PORT,
    };

    return koaWebpack({ config, hotClient });
  } else {
    // eslint-disable-next-line new-cap
    return mount("/assets", KoaStatic("./dist/assets/"));
  }
};

export default statics;
