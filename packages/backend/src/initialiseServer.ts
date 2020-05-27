import * as constants from "./constants";
import * as http from "http";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "@planv7/framework";
import AppContext from "./AppContext";
import { Container } from "inversify";
import Koa from "koa";
import { Logger } from "@planv7/application";
import bindDependencies from "./bootstrap/bindDependencies";
import connectToDatabase from "./bootstrap/connectToDatabase";
import getKey from "./bootstrap/getKey";
import loadMiddleware from "./bootstrap/loadMiddleware";
import loadRoutes from "./bootstrap/loadRoutes";

const initialiseServer = async (
  container: Container,
  logger: Logger,
  port?: number
): Promise<http.Server> => {
  const cleanupHandlers: (() => void)[] = [];

  logger.info(`Starting ${constants.SERVER_NAME}...`);
  const koaApp = new Koa<Koa.DefaultState, AppContext>();

  logger.info(`Connecting to database`);
  const database = await connectToDatabase(logger, cleanupHandlers);

  logger.info(`Loading public key`);
  const jwtPublicKey = getKey("JWT_PUBLIC_KEY", TEST_PUBLIC_KEY, logger);

  logger.info(`Loading private key`);
  const jwtPrivateKey = getKey("JWT_PRIVATE_KEY", TEST_PRIVATE_KEY, logger);

  logger.info(`Binding service dependencies`);
  bindDependencies(container, database, jwtPublicKey, jwtPrivateKey);

  logger.info(`Loading middleware`);
  await loadMiddleware(container, koaApp);

  logger.info(`Loading routes`);
  await loadRoutes(koaApp, container, logger);

  const server = await new Promise<http.Server>((resolve) => {
    resolve(koaApp.listen(port));
  });

  server.addListener;

  cleanupHandlers.forEach((handler) => server.addListener("close", handler));

  return server;
};

export default initialiseServer;
