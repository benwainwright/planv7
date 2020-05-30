import {
  CommandOutcome,
  LogoutCommand,
  UserLoginStateChangeEvent,
} from "@planv7/domain";

import {
  EventEmitterWrapper,
  Logger,
  LoginSessionDestroyer,
  TYPES,
} from "../ports";

import { inject, injectable } from "inversify";

import HandlerBase from "../core/HandlerBase";

@injectable()
export default class LogoutHandler extends HandlerBase<LogoutCommand> {
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  private readonly sessionDestroyer: LoginSessionDestroyer;

  public constructor(
    @inject(TYPES.logger) logger: Logger,
    @inject(TYPES.loginSessionDestroyer)
    sessionDestroyer: LoginSessionDestroyer,
    @inject(EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper
  ) {
    super();
    this.logger = logger;
    this.sessionDestroyer = sessionDestroyer;
    this.applicationEvents = applicationEvents;
  }

  public getCommandInstance(): LogoutCommand {
    return new LogoutCommand();
  }

  protected async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: LogoutCommand
  ): Promise<void> {
    this.logger.verbose("Executing logout handler");
    await this.sessionDestroyer.killSession();
    const event = new UserLoginStateChangeEvent(CommandOutcome.SUCCESS);
    this.applicationEvents.emitEvent(event);
  }
}
