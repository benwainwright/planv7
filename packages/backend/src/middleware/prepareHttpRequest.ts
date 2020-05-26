import { TYPES as APP, Logger } from "@planv7/application";
import { Context, Middleware, Next } from "koa";
import { IncomingMessage, ServerResponse } from "http";
import { Container } from "inversify";
import { ResponseAuthHeader } from "@planv7/framework";

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
