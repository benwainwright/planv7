import { DOMAIN_TYPES, DomainEvent } from "@planv5/domain";
import { Command, CommandBus, Handler } from "@planv5/domain/ports";
import { inject, injectable, multiInject, optional } from "inversify";
import { APP_TYPES } from "../ports/types";
import { ApplicationError } from "../errors/applicationError";
import { Logger } from "../ports/logger";
import { Dispatch } from "../ports";

@injectable()
export class SimpleCommandBus implements CommandBus {
  private readonly handlers: Handler<Command>[] | undefined;
  private readonly logger: Logger | undefined;
  private readonly dispatcher: Dispatch | undefined;

  public constructor(
    @optional()
    @multiInject(DOMAIN_TYPES.Handler)
    handlers?: Handler<Command>[],
    @inject(APP_TYPES.Logger)
    logger?: Logger,

    @optional()
    @inject(DOMAIN_TYPES.Dispatch)
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
    if (this.logger) {
      this.logger.verbose(
        `Trying to find a handler for ${command.identifier()}`
      );
    }
    if (this.handlers) {
      for (const handler of this.handlers) {
        if (this.logger) {
          this.logger.verbose(`Trying ${handler.constructor.name}`);
        }
        await handler.tryHandle(command);
        if (!command.shouldContinueHandling()) {
          if (this.logger) {
            this.logger.verbose(`Command has been handled`);
          }
          return;
        }
      }
    } else if (this.logger) {
        this.logger.verbose(`No handlers registered`);
      }

    if (this.dispatcher) {
      await this.dispatcher.dispatch(command);
      
    } else {
      throw new ApplicationError(
        `Could not find handler for ${command.toString()}`
      );
    }
  }
}
