import { Logger, getHandlerBinder } from "@planv7/application";
import AppContext from "../AppContext";
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
  app: Koa<Koa.DefaultState, AppContext>,
  logger: Logger,
  container: Container,
  handlers: {},
  cleanupHandlers: (() => void)[] = []
): void => {
  const socketApp = websockify(app);

  const apiContainer = new Container();
  apiContainer.parent = container;

  const handlerBinder = getHandlerBinder(apiContainer, handlers);

  container
    .bind<WebsocketConnection>(WebsocketConnection)
    .to(WebsocketConnection);

  socketApp.ws.use(
    route.all("/data", (context: AppContext | Koa.Context) => {
      try {
        const socketContainer = new Container();
        socketContainer.parent = apiContainer;

        handlerBinder(socketContainer);

        const socketContext = context as Koa.Context;

        socketContainer
          .bind<IncomingMessage>(IncomingMessage)
          .toConstantValue(socketContext.req);

        socketContainer
          .bind<WebSocket>(WebSocket)
          .toConstantValue(socketContext.websocket);

        const connection = socketContainer.get<WebsocketConnection>(
          WebsocketConnection
        );
        clients.push(connection);
        cleanupHandlers.push(() => clients.forEach((client) => client.close()));
      } catch (error) {
        logger.error(error);
      }
    })
  );
};

export default websocketApi;
