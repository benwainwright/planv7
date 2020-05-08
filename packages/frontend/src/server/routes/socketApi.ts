import WebSocket from "ws";
import Koa from "koa";
import route from "koa-route";
import websockify from "koa-websocket";
import { IncomingMessage } from "http";
import { Container } from "inversify";
import { DOMAIN_TYPES } from "@planv5/domain";
import { CommandBus } from "@planv5/domain/ports";
import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { WebsocketConnection } from "@planv5/framework";

import { SimpleCommandBus, getHandlerBinder } from "@planv5/application";

const clients: WebsocketConnection[] = [];

export const configureDataApi = (
  app: Koa,
  logger: Logger,
  container: Container,
  handlers: {}
) => {
  const socketApp = websockify(app);

  const apiContainer = new Container();
  apiContainer.parent = container;

  apiContainer
    .bind<EventEmitterWrapper>(APP_TYPES.EventEmitterWrapper)
    .to(EventEmitterWrapper)
    .inRequestScope();

  apiContainer
    .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
    .to(SimpleCommandBus)
    .inRequestScope();

  const handlerBinder = getHandlerBinder(apiContainer, handlers);

  container
    .bind<WebsocketConnection>(WebsocketConnection)
    .to(WebsocketConnection);

  socketApp.ws.use(
    route.all("/data", (context: Koa.Context) => {
      try {
        debugger;
        const socketContainer = new Container();
        socketContainer.parent = apiContainer;

        handlerBinder(socketContainer);

        socketContainer
          .bind<IncomingMessage>(IncomingMessage)
          .toConstantValue(context.req);

        socketContainer
          .bind<WebSocket>(WebSocket)
          .toConstantValue(context.websocket);

        const connection = socketContainer.get<WebsocketConnection>(
          WebsocketConnection
        );
        clients.push(connection);
      } catch (error) {
        logger.error(error);
      }
    })
  );
};
