import { Command, CommandBus, TYPES as DOMAIN, Handler } from "@choirpractise/domain";
import { Dispatch, TYPES } from "../ports";
import { inject, injectable, multiInject, optional } from "inversify";

import ApplicationError from "../ApplicationError";
import Logger from "../ports/Logger";

@injectable()
export default class SimpleCommandBus implements CommandBus {
  private readonly handlers: Handler<Command>[] | undefined;
  private readonly logger: Logger | undefined;
  private readonly dispatcher: Dispatch | undefined;

  public constructor(
    @optional()
    @multiInject(DOMAIN.handler)
    handlers?: Handler<Command>[],
    @inject(TYPES.logger)
    logger?: Logger,

    @optional()
    @inject(DOMAIN.dispatch)
    dispatcher?: Dispatch
  ) {
    this.handlers = handlers;
    this.logger = logger;
    this.dispatcher = dispatcher;
    if (this.logger) {
      this.logger.verbose("Instantiating command bus");
    }
  }

  public async execute(command: Command): Promise<void> {
    this.logger?.verbose(
      `Trying to find a handler for ${command.identifier()}`
    );

    if (this.handlers) {
      for (const handler of this.handlers) {
        this.logger?.verbose(`Trying ${handler.constructor.name}`);
        // eslint-disable-next-line no-await-in-loop
        await handler.tryHandle(command);
        if (!command.shouldContinueHandling()) {
          this.logger?.verbose(`Command has been handled`);
          return;
        }
      }
    }

    this.logger?.verbose(`No handlers registered`);

    if (this.dispatcher) {
      await this.dispatcher.dispatch(command);
    } else {
      throw new ApplicationError(
        `Could not find handler for ${command.toString()}`
      );
    }
  }
}
