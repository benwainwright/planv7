import "reflect-metadata";
import { Arg, Substitute } from "@fluffy-spoon/substitute";

import {
  CommandOutcome,
  LoginCommand,
  UserLoginStateChangeEvent,
} from "@choirpractise/domain";

import EventEmitterWrapper from "../core/EventEmitterWrapper";
import Logger from "../ports/Logger";
import LoginHandler from "./LoginHandler";
import LoginProvider from "../ports/LoginProvider";

describe("LoginHandler", (): void => {
  it("Calls the loginProvider with the username and password", async (): Promise<
    void
  > => {
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();
    const emitter = Substitute.for<EventEmitterWrapper>();
    const handler = new LoginHandler(logger, loginProvider, emitter);

    await handler.tryHandle(new LoginCommand("foo", "bar"));
    loginProvider.received().login("foo", "bar");
  });

  it("Emits a User Login State Change Event", async (): Promise<void> => {
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();
    const emitter = Substitute.for<EventEmitterWrapper>();
    const handler = new LoginHandler(logger, loginProvider, emitter);

    await handler.tryHandle(new LoginCommand("foo", "bar"));

    emitter.received().emitEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Arg.is((argument: any): boolean => {
        return (
          argument.getOutcome() === CommandOutcome.SUCCESS &&
          argument instanceof UserLoginStateChangeEvent
        );
      })
    );
  });
});
