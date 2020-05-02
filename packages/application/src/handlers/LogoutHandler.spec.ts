import { Arg, Substitute } from "@fluffy-spoon/substitute";

import {
  CommandOutcome,
  LogoutCommand,
  USER_LOGIN_STATE_CHANGE_EVENT,
  UserLoginStateChangeEvent,
} from "@planv7/domain";

import EventEmitterWrapper from "../core/EventEmitterWrapper";
import LoginSessionDestroyer from "../ports/LoginSessionDestroyer";
import Logger from "../ports/Logger";
import LogoutHandler from "./LogoutHandler";

describe("Logouthandler", (): void => {
  it("Calls the sesssion destroyer when a command is received", async (): Promise<
    void
  > => {
    const logger = Substitute.for<Logger>();
    const sessionDestroyer = Substitute.for<LoginSessionDestroyer>();
    const emitter = Substitute.for<EventEmitterWrapper>();

    const handler = new LogoutHandler(logger, sessionDestroyer, emitter);
    const command = new LogoutCommand();

    await handler.tryHandle(command);

    sessionDestroyer.received().killSession();
  });

  it("Emits a UserLoginStateChangeEvent when done", async (): Promise<void> => {
    const logger = Substitute.for<Logger>();
    const sessionDestroyer = Substitute.for<LoginSessionDestroyer>();
    const emitter = Substitute.for<EventEmitterWrapper>();

    const handler = new LogoutHandler(logger, sessionDestroyer, emitter);
    const command = new LogoutCommand();

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
