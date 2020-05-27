import "source-map-support/register";
import * as constants from "./constants";
import { Container } from "inversify";
import initialiseLogger from "./bootstrap/initialiseLogger";
import initialiseServer from "./initialiseServer";

const container = new Container();
const logger = initialiseLogger(container);

initialiseServer(container, logger, constants.SERVER_PORT)
  .then(() => {
    return logger.info(`Listening on port ${constants.SERVER_PORT}`);
  })
  .catch((error: Error) => {
    logger.error(error.message);
  });
