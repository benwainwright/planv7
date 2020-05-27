import * as constants from "./constants";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "@planv7/framework";
import AppContext from "./AppContext";
import { Container } from "inversify";
import { Logger } from "@planv7/application";
import Koa from "koa";
import bindDependencies from "./bootstrap/bindDependencies";
import connectToDatabase from "./bootstrap/connectToDatabase";
import getKey from "./bootstrap/getKey";
import loadMiddleware from "./bootstrap/loadMiddleware";
import loadRoutes from "./bootstrap/loadRoutes";

const initialiseServer = async (
  container: Container,
  logger: Logger
): Promise<Koa<Koa.DefaultState, AppContext>> => {
  logger.info(`Starting ${constants.SERVER_NAME}...`);
  const koaApp = new Koa<Koa.DefaultState, AppContext>();

  logger.info(`Connecting to database`);
  const database = await connectToDatabase(logger);

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
  return koaApp;
};

export default initialiseServer;
