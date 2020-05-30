import { Arg, Substitute } from "@fluffy-spoon/substitute";

import {
  CommandOutcome,
  LogoutCommand,
  UserLoginStateChangeEvent,
} from "@choirpractise/domain";

import EventEmitterWrapper from "../core/EventEmitterWrapper";
import Logger from "../ports/Logger";
import LoginSessionDestroyer from "../ports/LoginSessionDestroyer";
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
      Arg.is((argument: any): boolean => {
        return (
          argument.getOutcome() === CommandOutcome.SUCCESS &&
          argument instanceof UserLoginStateChangeEvent
        );
      })
    );
  });
});
