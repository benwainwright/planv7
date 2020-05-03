import { inject, injectable } from "inversify";

import {
  CommandOutcome,
  RegisterUserCommand,
  User,
  UserLoginStateChangeEvent,
  UserRegisteredEvent,
} from "@planv5/domain";

import HandlerBase from "../core/HandlerBase";

import { EventEmitterWrapper, LoginProvider, Repository } from "../ports";
import { APP_TYPES } from "../ports/types";
import Logger from "../ports/Logger";

@injectable()
export default class RegisterUserHandler extends HandlerBase<
  RegisterUserCommand
> {
  private readonly userRepository: Repository<User>;
  private readonly loginProvider: LoginProvider;

  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;

  public constructor(
    @inject(APP_TYPES.UserRepository) userRepository: Repository<User>,
    @inject(APP_TYPES.LoginProvider) loginProvider: LoginProvider,
    @inject(APP_TYPES.Logger) logger: Logger,
    @inject(APP_TYPES.EventEmitterWrapper)
    applicationEvents: EventEmitterWrapper
  ) {
    super();
    this.userRepository = userRepository;
    this.applicationEvents = applicationEvents;
    this.logger = logger;
    this.loginProvider = loginProvider;
    this.logger.verbose("Register user handler initialised");
  }

  public getCommandInstance(): RegisterUserCommand {
    return new RegisterUserCommand();
  }

  public async execute(command: RegisterUserCommand): Promise<void> {
    this.logger.verbose(`${command} received by RegisterUserHandler`);
    const user = new User(
      command.getName(),
      command.getEmail(),
      command.getPassword()
    );
    await this.userRepository.saveNew(user);
    this.logger.info(`New user ${user} saved!`);
    const registeredEvent = new UserRegisteredEvent(
      CommandOutcome.SUCCESS,
      user
    );

    this.applicationEvents.emitEvent(registeredEvent);
    const loggedInUser = await this.loginProvider.login(
      command.getName(),
      command.getPassword()
    );

    this.logger.info(`Login successful!`);
    const loginEvent = new UserLoginStateChangeEvent(
      CommandOutcome.SUCCESS,
      loggedInUser
    );
    this.applicationEvents.emitEvent(loginEvent);
  }

  public toString(): string {
    return "RegisterUserHandler";
  }
}
