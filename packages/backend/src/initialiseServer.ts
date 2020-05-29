import * as constants from "./constants";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "@planv7/framework";
import AppContext from "./AppContext";
import { Container } from "inversify";
import Koa from "koa";
import { Logger } from "@planv7/application";
import bindDependencies from "./bootstrap/bindDependencies";
import connectToDatabase from "./bootstrap/connectToDatabase";
import getKey from "./bootstrap/getKey";
import initialiseLogger from "./bootstrap/initialiseLogger";
import loadMiddleware from "./bootstrap/loadMiddleware";
import loadRoutes from "./bootstrap/loadRoutes";

export interface InitialisationResult {
  cleanupHandlers?: (() => void)[];
  koaApp?: Koa<Koa.DefaultState, AppContext>;
  logger?: Logger;
}

const initialiseServer = async (): Promise<InitialisationResult> => {
  const cleanupHandlers: (() => void)[] = [];

  const container = new Container();
  const logger = initialiseLogger(container);
  try {
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
    loadMiddleware(container, koaApp);

    logger.info(`Loading routes`);
    await loadRoutes(koaApp, container, logger);

    return { koaApp, cleanupHandlers, logger };
  } catch (error) {
    logger.error(error);
    return {};
  }
};

export default initialiseServer;
