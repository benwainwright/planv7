import { Middleware } from "koa";
import { ResponseAuthHeader, TYPES as FRAMEWORK } from "@planv7/framework";
import { Logger, TYPES as APP } from "@planv7/application";
import { Context, Next, Request } from "koa";
import { Container } from "inversify";
import { IncomingMessage, ServerResponse } from "http";

const prepareHttpRequest = (parentContainer: Container): Middleware => {
  return async (context: Context, next: Next): Promise<void> => {
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
