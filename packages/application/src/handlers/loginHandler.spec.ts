import "reflect-metadata";
import { CommandOutcome, USER_LOGIN_STATE_CHANGE_EVENT } from "@planv5/domain";
import { UserLoginStateChangeEvent } from "@planv5/domain/events";
import { EventEmitterWrapper } from "../core/EventEmitterWrapper";
import { LoginHandler } from "./loginHandler";
import { Substitute, Arg } from "@fluffy-spoon/substitute";
import { LoginProvider } from "../ports/loginProvider";
import { Logger } from "../ports/logger";
import { LoginCommand } from "@planv5/domain/commands";

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
      Arg.is((arg: any): boolean => {
        return (
          arg.getOutcome() === CommandOutcome.SUCCESS &&
          arg instanceof UserLoginStateChangeEvent
        );
      })
    );
  });
});
