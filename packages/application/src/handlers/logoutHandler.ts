import { CommandOutcome, USER_LOGIN_STATE_CHANGE_EVENT } from "@planv5/domain";
import { inject, injectable } from "inversify";
import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger,
  LoginSessionDestroyer
} from "../ports";
import { HandlerBase } from "../core/handlerBase";
import { LogoutCommand } from "@planv5/domain/commands";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";

@injectable()
export class LogoutHandler extends HandlerBase<LogoutCommand> {
  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;
  private readonly sessionDestroyer: LoginSessionDestroyer;

  public constructor(
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(APP_TYPES.LoginSessionDestroyer)
    sessionDestroyer: LoginSessionDestroyer,
    @inject(APP_TYPES.EventEmitterWrapper)
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
    const event = new UserLoginStateChangeEvent(
      CommandOutcome.SUCCESS,
      undefined
    );
    this.applicationEvents.emitEvent(event);
  }
}
