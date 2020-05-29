import Koa from "koa";
import koaStatic from "koa-static";
import mount from "koa-mount";

const statics = (): Koa.Middleware => {
  const assetsDir = process.env.ASSETS_DIR ?? "./dist/assets";
  return mount("/assets", koaStatic(assetsDir));
};

export default statics;
