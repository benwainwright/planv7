import AppContext from "../AppContext";
import { Container } from "inversify";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import prepareHttpRequest from "../middleware/prepareHttpRequest";

const loadMiddleware = (
  container: Container,
  koaApp: Koa<Koa.DefaultState, AppContext>
): void => {
  koaApp.use(bodyParser());
  koaApp.use(prepareHttpRequest(container));
};

export default loadMiddleware;
