import {
  CommandOutcome,
  RegisterUserCommand,
  User,
  UserLoginStateChangeEvent,
  UserRegisteredEvent,
} from "@planv7/domain";

import { EventEmitterWrapper, LoginProvider, Repository } from "../ports";

import { inject, injectable } from "inversify";

import HandlerBase from "../core/HandlerBase";
import Logger from "../ports/Logger";
import TYPES from "../ports/TYPES";

@injectable()
export default class RegisterUserHandler extends HandlerBase<
  RegisterUserCommand
> {
  private readonly userRepository: Repository<User>;
  private readonly loginProvider: LoginProvider;

  private readonly logger: Logger;
  private readonly applicationEvents: EventEmitterWrapper;

  public constructor(
    @inject(TYPES.userRepository) userRepository: Repository<User>,
    @inject(TYPES.loginProvider) loginProvider: LoginProvider,
    @inject(TYPES.logger) logger: Logger,
    @inject(EventEmitterWrapper)
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
    this.logger.verbose(`${command} received by RegisterUserHandler :-)`);
    const user = new User(
      command.getName(),
      command.getEmail(),
      command.getPassword()
    );
    await this.userRepository.saveNew(user);
    this.logger.info(`New user ${user} saved! :)`);
    const registeredEvent = new UserRegisteredEvent(
      CommandOutcome.SUCCESS,
      user
    );

    this.applicationEvents.emitEvent(registeredEvent);
    const loggedInUser = await this.loginProvider.login(
      command.getName(),
      command.getPassword()
    );

    this.logger.info(`Login successful! :-|`);
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
