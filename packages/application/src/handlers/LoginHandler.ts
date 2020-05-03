import "reflect-metadata";

import {
  CommandOutcome,
  LoginCommand,
  UserLoginStateChangeEvent,
} from "@planv7/domain";

import { inject, injectable } from "inversify";

import { EventEmitterWrapper } from "../ports";
import HandlerBase from "../core/HandlerBase";
import Logger from "../ports/Logger";
import LoginProvider from "../ports/LoginProvider";
import TYPES from "../ports/TYPES";

@injectable()
export default class LoginHandler extends HandlerBase<LoginCommand> {
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  private readonly loginProvider: LoginProvider;

  public constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.LoginProvider) loginProvider: LoginProvider,
    @inject(TYPES.EventEmitterWrapper)
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
