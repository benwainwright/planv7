import "reflect-metadata";

import { Command, TYPES as DOMAIN, Handler } from "@choirpractise/domain";
import { Container } from "inversify";
import Logger from "../ports/Logger";
import TYPES from "../ports/TYPES";

export interface HandlerMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
}

/**
 * Try to resolve all the handlers first. If they can't be resolved
 * it's probably because a dependency isn't available in the current
 * execution environment
 */
const getBindableHandlers = (
  container: Container,
  handlers: HandlerMap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Map<string, any> => {
  const logger = container.get<Logger>(TYPES.logger);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toBind = new Map<string, any>();
  logger.verbose(`Starting handler mapping dry run`);
  for (const constructorName in handlers) {
    if (Object.prototype.hasOwnProperty.call(handlers, constructorName)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constructor = handlers[constructorName];
        logger.info(`Resolving ${constructorName}`);
        container.resolve(constructor);
        toBind.set(constructorName, constructor);
      } catch (error) {
        logger.debug(
          `Cannot bind the following handler: ${constructorName}. Error: ${error}`
        );
        // There was an error, don't bother to
        // add to the bind list
      }
    }
  }
  return toBind;
};

const getHandlerBinder = (
  container: Container,
  handlers: HandlerMap
): ((container: Container) => void) => {
  const toBind = getBindableHandlers(container, handlers);
  const logger = container.get<Logger>(TYPES.logger);

  return (theContainer: Container): void => {
    logger.verbose(`Binding handlers`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toBind.forEach((constructor: any, name: string): void => {
      try {
        theContainer.bind<Handler<Command>>(DOMAIN.handler).to(constructor);
        logger.verbose(`Binding handler ${name}`);
      } catch (error) {
        logger.error(`Unable to bind ${name} because of error: ${error}`);
      }
    });
  };
};

export default getHandlerBinder;
