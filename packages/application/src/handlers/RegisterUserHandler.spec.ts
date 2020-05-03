import "reflect-metadata";

import { Arg, Substitute } from "@fluffy-spoon/substitute";

import {
  CommandOutcome,
  RegisterUserCommand,
  User,
  UserLoginStateChangeEvent,
  UserRegisteredEvent,
} from "@planv7/domain";

import {
  EventEmitterWrapper,
  Logger,
  LoginProvider,
  Repository,
} from "../ports";

import RegisterUserHandler from "./RegisterUserHandler";

describe("RegisterUserHandler", (): void => {
  test("Calls the repository save method when passed a command", (): void => {
    const repository = Substitute.for<Repository<User>>();
    const logger = Substitute.for<Logger>();
    const loginProvider = Substitute.for<LoginProvider>();
    loginProvider
      .login(Arg.all())
      .returns(Promise.resolve(new User("foo", "bar", "baz")));
    const handler = new RegisterUserHandler(
      repository,
      loginProvider,
      logger,
      new EventEmitterWrapper(logger)
    );
    const command = new RegisterUserCommand("foo", "bar", "password");
    handler.tryHandle(command);
    repository.received().saveNew(Arg.any());
  });

  test("Passes a correctly constructed User to the repository", (): void => {
    const loginProvider = Substitute.for<LoginProvider>();
    loginProvider
      .login(Arg.all())
      .returns(Promise.resolve(new User("foo", "bar", "baz")));
    const repository = Substitute.for<Repository<User>>();
    const logger = Substitute.for<Logger>();
    const handler = new RegisterUserHandler(
      repository,
      loginProvider,
      logger,
      new EventEmitterWrapper(logger)
    );
    const user = new User("name", "a@b.d", "password");
    const command = new RegisterUserCommand("name", "a@b.d", "password");
    handler.tryHandle(command);

    const userMatcher = (u: User): boolean => {
      return u.getEmail() === user.getEmail() && u.getName() === user.getName();
    };
    repository.received().saveNew(Arg.is(userMatcher));
  });

  test("Emits a UserRegisteredEvent event after user is registered", async (): Promise<
    void
  > => {
    const loginProvider = Substitute.for<LoginProvider>();
    loginProvider
      .login(Arg.all())
      .returns(Promise.resolve(new User("foo", "bar", "baz")));
    const repository = Substitute.for<Repository<User>>();
    const logger = Substitute.for<Logger>();
    const eventEmitter = new EventEmitterWrapper(logger);
    const handler = new RegisterUserHandler(
      repository,
      loginProvider,
      logger,
      eventEmitter
    );
    const user = new User("name", "a@b.d", "password");
    const command = new RegisterUserCommand("name", "a@b.d", "password");
    const event = jest.fn();
    eventEmitter.onEvent(event);

    await handler.tryHandle(command);
    expect(event).toBeCalledWith(
      new UserRegisteredEvent(CommandOutcome.SUCCESS, user)
    );
  });

  it("Calls the loginProvider with the username and password", async (): Promise<
    void
  > => {
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    const repository = Substitute.for<Repository<User>>();
    const emitter = Substitute.for<EventEmitterWrapper>();

    const handler = new RegisterUserHandler(
      repository,
      loginProvider,
      logger,
      emitter
    );
    const command = new RegisterUserCommand("name", "a@b.d", "password");

    loginProvider.login(Arg.all()).returns(Promise.resolve(null));
    await handler.tryHandle(command);
    loginProvider.received().login("name", "password");
  });

  it("Emits a User Login State Change Event", async (): Promise<void> => {
    const loginProvider = Substitute.for<LoginProvider>();
    loginProvider
      .login(Arg.all())
      .returns(Promise.resolve(new User("foo", "bar", "baz")));
    const logger = Substitute.for<Logger>();
    const repository = Substitute.for<Repository<User>>();
    const emitter = Substitute.for<EventEmitterWrapper>();

    const handler = new RegisterUserHandler(
      repository,
      loginProvider,
      logger,
      emitter
    );

    const command = new RegisterUserCommand("name", "a@b.d", "password");
    await handler.tryHandle(command);

    emitter.received().emitEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Arg.is((arg: any): boolean => {
        return (
          arg.getOutcome() === CommandOutcome.SUCCESS &&
          arg instanceof UserLoginStateChangeEvent
        );
      })
    );
  });
});
