import AppContext from "../AppContext";
import { Container } from "inversify";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import prepareHttpRequest from "../middleware/prepareHttpRequest";

const loadMiddleware = async (
  container: Container,
  koaApp: Koa<Koa.DefaultState, AppContext>
): Promise<void> => {
  koaApp.use(bodyParser());
  koaApp.use(await prepareHttpRequest(container));
};

export default loadMiddleware;
