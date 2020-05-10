import * as constants from "./constants";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "@planv7/framework";
import { Container } from "inversify";
import Koa from "koa";
import bindDependencies from "./bootstrap/bindDependencies";
import connectToDatabase from "./bootstrap/connectToDatabase";
import getKey from "./bootstrap/getKey";
import initialiseLogger from "./bootstrap/initialiseLogger";
import loadMiddleware from "./bootstrap/loadMiddleware";
import loadRoutes from "./bootstrap/loadRoutes";

const SERVER_PORT = 80;

(async (): Promise<void> => {
  const container = new Container();
  const logger = initialiseLogger(container);

  logger.info(`Starting ${constants.SERVER_NAME}...`);
  const koaApp = new Koa();

  logger.info(`Connecting to database`);
  const database = await connectToDatabase();

  const jwtPublicKey = await getKey("JWT_PUBLIC_KEY", TEST_PUBLIC_KEY, logger);

  const jwtPrivateKey = await getKey(
    "JWT_PRIVATE_KEY",
    TEST_PRIVATE_KEY,
    logger
  );

  logger.info(`Binding service dependencies`);
  await bindDependencies(container, database, jwtPublicKey, jwtPrivateKey);

  logger.info(`Loading middleware`);
  loadMiddleware(koaApp);

  logger.info(`Loading routes`);
  await loadRoutes(koaApp);

  koaApp.listen(SERVER_PORT, () => {
    logger.info(`Listening on port ${SERVER_PORT}`);
  });
})();
