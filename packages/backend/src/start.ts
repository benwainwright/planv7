import * as constants from "./constants";
import { HANDLERS, getHandlerBinder } from "@planv7/application";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "@planv7/framework";
import AppContext from "./AppContext";
import { Container } from "inversify";
import Koa from "koa";
import bindDependencies from "./bootstrap/bindDependencies";
import connectToDatabase from "./bootstrap/connectToDatabase";
import getKey from "./bootstrap/getKey";
import initialiseLogger from "./bootstrap/initialiseLogger";
import loadMiddleware from "./bootstrap/loadMiddleware";
import loadRoutes from "./bootstrap/loadRoutes";

(async (): Promise<void> => {
  const container = new Container();
  const logger = initialiseLogger(container);
  try {
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

    logger.info(`Binding handlers`);
    const binder = getHandlerBinder(container, HANDLERS);
    binder(container);

    logger.info(`Loading middleware`);
    await loadMiddleware(container, koaApp);

    logger.info(`Loading routes`);
    await loadRoutes(koaApp, container, logger);

    koaApp.listen(constants.SERVER_PORT, () => {
      logger.info(`Listening on port ${constants.SERVER_PORT}`);
    });
  } catch (error) {
    logger.error(error.message);
  }
})().catch((error: Error) => {
  // If we get here, there was an error during logger
  // initialisation
  // eslint-disable-next-line no-console
  console.log(error);
});
