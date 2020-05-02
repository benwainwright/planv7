import "reflect-metadata";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";
import {
  CommandOutcome,
  DomainEvent,
  USER_LOGIN_STATE_CHANGE_EVENT,
} from "@planv5/domain";
import { APP_TYPES } from "../ports/types";
import { Logger } from "../ports/logger";
import { LoginProvider } from "../ports/loginProvider";
import { inject, injectable } from "inversify";

import { LoginCommand } from "@planv5/domain/commands";
import { HandlerBase } from "../core/handlerBase";
import { EventEmitterWrapper } from "../ports";

@injectable()
export default class LoginHandler extends HandlerBase<LoginCommand> {
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  private readonly loginProvider: LoginProvider;

  public constructor(
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(APP_TYPES.LoginProvider) loginProvider: LoginProvider,
    @inject(APP_TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper
  ) {
    super();
    this.logger = logger;
    this.applicationEvents = applicationEvents;
    this.loginProvider = loginProvider;
  }

  public getCommandInstance(): LoginCommand {
    return new LoginCommand();
  }

  protected async execute(command: LoginCommand): Promise<void> {
    const user = await this.loginProvider.login(
      command.getUsername(),
      command.getPassword()
    );

    this.logger.info(`Login successful!`);
    const event = new UserLoginStateChangeEvent(CommandOutcome.SUCCESS, user);
    this.applicationEvents.emitEvent(event);
  }
}
