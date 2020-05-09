import Koa from "koa";
import bodyParser from "koa-bodyparser";

const loadMiddleware = (koaApp: Koa): void => {
  koaApp.use(bodyParser());
};

export default loadMiddleware;
