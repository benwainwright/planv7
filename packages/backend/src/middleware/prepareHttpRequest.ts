import * as Koa from "koa";
import * as koaWebsocket from "koa-websocket";
import { TYPES as APP, Logger } from "@choirpractise/application";
import { IncomingMessage, ServerResponse } from "http";
import { Container } from "inversify";
import { ResponseAuthHeader } from "@choirpractise/framework";

const prepareHttpRequest = (
  parentContainer: Container
): koaWebsocket.Middleware<Koa.DefaultState, Koa.DefaultContext> => {
  return async (
    context: koaWebsocket.MiddlewareContext<Koa.DefaultState>,
    next: Koa.Next
  ): Promise<void> => {
    const container = new Container();

    container.parent = parentContainer;
    context.container = container;

    const logger = container.get<Logger>(APP.logger);
    logger.verbose(`Request: ${context.method} ${context.path}`);
    logger.verbose(`Headers: ${JSON.stringify(context.headers)}`);
    if (context.body) {
      logger.verbose(`Body: ${context.body}`);
    }

    container
      .bind<IncomingMessage>(IncomingMessage)
      .toConstantValue(context.req);

    container.bind<ServerResponse>(ServerResponse).toConstantValue(context.res);

    context.authHeader = new ResponseAuthHeader();

    container
      .bind<ResponseAuthHeader>(ResponseAuthHeader)
      .toConstantValue(context.authHeader);

    await next();
  };
};

export default prepareHttpRequest;
