import {
  TYPES as APP,
  EventEmitterWrapper,
  Handlers,
  Logger,
  SimpleCommandBus,
  getHandlerBinder,
} from "@planv7/application";
import { CommandBus, TYPES as DOMAIN } from "@planv7/domain";
import { Container } from "inversify";
import { IncomingMessage } from "http";
import Koa from "koa";
import WebSocket from "ws";
import { WebsocketConnection } from "@planv7/framework";
import route from "koa-route";
import websockify from "koa-websocket";

// eslint-disable-next-line sonarjs/no-unused-collection
const clients: WebsocketConnection[] = [];

const websocketApi = (
  app: Koa,
  logger: Logger,
  container: Container,
  handlers: Handlers
): void => {
  const socketApp = websockify(app);

  const apiContainer = new Container();
  apiContainer.parent = container;

  apiContainer
    .bind<EventEmitterWrapper>(APP.eventEmitterWrapper)
    .to(EventEmitterWrapper)
    .inRequestScope();

  apiContainer
    .bind<CommandBus>(DOMAIN.commandBus)
    .to(SimpleCommandBus)
    .inRequestScope();

  const handlerBinder = getHandlerBinder(apiContainer, handlers);

  container
    .bind<WebsocketConnection>(WebsocketConnection)
    .to(WebsocketConnection);

  socketApp.ws.use(
    route.all("/data", (context: Koa.Context) => {
      try {
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

export default websocketApi;
