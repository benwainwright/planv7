import { inject, injectable } from "inversify";
import "reflect-metadata";
import {
  CommandOutcome,
  DomainEvent,
  LoginCommand,
  USER_LOGIN_STATE_CHANGE_EVENT,
  UserLoginStateChangeEvent,
} from "@planv7/domain";
import { APP_TYPES } from "../ports/types";
import Logger from "../ports/Logger";
import LoginProvider from "../ports/LoginProvider";

import HandlerBase from "../core/HandlerBase";
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
