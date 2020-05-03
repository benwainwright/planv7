import nock from "nock";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { ApplicationError } from "@planv5/application/errors";
import { AuthorisingDispatcher } from "./AuthorisingDispatcher";
import { WebsocketClient } from "../WebsocketClient";
import { Serialiser, User } from "@planv5/domain";
import { Command } from "@planv5/domain/ports";
import {
  CurrentLoginSession,
  EventEmitterWrapper
} from "@planv5/application/ports";

describe("Authorising dispatcher", () => {
  it("Sends commands via the websocket client if there is a current user", async () => {
    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }
    }

    const command = new MockCommand();

    const client = Substitute.for<WebsocketClient>();
    const serialiser = Substitute.for<Serialiser>();
    const session = Substitute.for<CurrentLoginSession>();
    const events = Substitute.for<EventEmitterWrapper>();
    const dispatcher = new AuthorisingDispatcher(
      client,
      serialiser,
      session,
      "foo",
      events
    );

    client.dispatch(command).returns(Promise.resolve());

    session.getCurrentUser().returns(new User("foo", "bar", "baz"));

    await dispatcher.dispatch(command);

    client.received().dispatch(command);
  });

  it("Sends commands via the HTTP auth endpoint if there is no user", async () => {
    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }
    }

    const command = new MockCommand();

    const client = Substitute.for<WebsocketClient>();
    const serialiser = Substitute.for<Serialiser>();
    const session = Substitute.for<CurrentLoginSession>();
    const events = Substitute.for<EventEmitterWrapper>();
    const dispatcher = new AuthorisingDispatcher(
      client,
      serialiser,
      session,
      "http://localhost/auth",
      events
    );

    const request = nock("http://localhost")
      .post("/auth", { $: "MockCommand", instance: { handled: 0 } })
      .reply(200);

    serialiser
      .serialise(command)
      .returns('{"$": "MockCommand", "instance": {"handled": 0}}');

    session.getCurrentUser().returns(undefined);

    await dispatcher.dispatch(command);

    request.done();
  });

  it("Forwards the HTTP request on to the login session if the response is successfull", async () => {
    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }
    }

    const command = new MockCommand();

    const events = Substitute.for<EventEmitterWrapper>();
    const client = Substitute.for<WebsocketClient>();
    const serialiser = Substitute.for<Serialiser>();
    const session = Substitute.for<CurrentLoginSession>();
    const dispatcher = new AuthorisingDispatcher(
      client,
      serialiser,
      session,
      "http://localhost/auth",
      events
    );

    const request = nock("http://localhost")
      .post("/auth", { $: "MockCommand", instance: { handled: 0 } })
      .reply(200);

    serialiser
      .serialise(command)
      .returns('{"$": "MockCommand", "instance": {"handled": 0}}');

    session.getCurrentUser().returns(undefined);

    await dispatcher.dispatch(command);
    session.received().setCurrentUserFromHttpResponse(Arg.any());
  });

  it("Catches errors from the auth endpoint and emits them as application errors", async () => {
    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }
    }

    const command = new MockCommand();

    const events = Substitute.for<EventEmitterWrapper>();
    const client = Substitute.for<WebsocketClient>();
    const serialiser = Substitute.for<Serialiser>();
    const session = Substitute.for<CurrentLoginSession>();
    session.getCurrentUser().returns(undefined);
    const dispatcher = new AuthorisingDispatcher(
      client,
      serialiser,
      session,
      "http://localhost/auth",
      events
    );

    const errorString = '{"$":"ApplicationError","instance":{"name":"ApplicationError","message":"Login Failed"}}';
    const theError = new ApplicationError("Login Failed");

    const request = nock("http://localhost")
      .post("/auth", { $: "MockCommand", instance: { handled: 0 } })
      .reply(403, errorString);

    // @ts-ignore
    events.emitError(Arg.any()).returns();

    serialiser
      .serialise(command)
      .returns('{"$": "MockCommand", "instance": {"handled": 0}}');

    serialiser
      .unSerialise(errorString)
      .returns(theError);

    await dispatcher.dispatch(command);
    session.didNotReceive().setCurrentUserFromHttpResponse(Arg.any());
    events.received().emitError(theError);
    events.didNotReceive().emitEvent(Arg.any());
  });
});
