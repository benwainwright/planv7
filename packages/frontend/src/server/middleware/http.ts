import { Context , Middleware, Next, Request } from "koa";
import { ResponseAuthHeader } from "@planv5/framework";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";
import { APP_TYPES, Logger } from "@planv5/application/ports";

import { Container } from "inversify";
import { IncomingMessage, ServerResponse } from "http";

export const prepareHttpRequest = (parentContainer: Container): Middleware => {
  return async (context: Context, next: Next): Promise<void> => {
    const container = new Container();

    container.parent = parentContainer;
    context.container = container;

    const logger = container.get<Logger>(APP_TYPES.Logger);
    logger.verbose(`Request: ${context.method} ${context.path}`);
    logger.verbose(`Headers: ${JSON.stringify(context.headers)}`);
    if(context.body) {
      logger.verbose(`Body: ${context.body}`);
    }

    container
      .bind<IncomingMessage>(IncomingMessage)
      .toConstantValue(context.req);

    container.bind<ServerResponse>(ServerResponse).toConstantValue(context.res);

    context.authHeader = new ResponseAuthHeader();

    container
      .bind<ResponseAuthHeader>(FRAMEWORK_TYPES.ResponseAuthHeader)
      .toConstantValue(context.authHeader);

    await next();
  };
};
