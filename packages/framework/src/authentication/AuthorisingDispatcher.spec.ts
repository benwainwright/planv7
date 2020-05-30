import {
  ApplicationError,
  CurrentLoginSession,
  EventEmitterWrapper,
  Serialiser,
} from "@choirpractise/application";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { Command, User } from "@choirpractise/domain";

import AuthorisingDispatcher from "./AuthorisingDispatcher";
import WebsocketClient from "../WebsocketClient";
import nock from "nock";

const LOCALHOST = "http://localhost";
const AUTH = "/auth";
const LOCALHOST_SLASH_AUTH = `${LOCALHOST}${AUTH}`;
const MOCK_COMMAND_OBJECT = { $: "MockCommand", instance: { handled: 0 } };
const MOCK_COMMAND_STRING = '{"$": "MockCommand", "instance": {"handled": 0}}';

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
      LOCALHOST_SLASH_AUTH,
      events
    );

    const request = nock(LOCALHOST).post(AUTH).reply(200);

    serialiser.serialise(command).returns("");

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
      `${LOCALHOST}/auth`,
      events
    );

    nock(LOCALHOST).post(AUTH, MOCK_COMMAND_OBJECT).reply(200);

    serialiser.serialise(command).returns(MOCK_COMMAND_STRING);

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
      LOCALHOST_SLASH_AUTH,
      events
    );

    const errorString =
      '{"$":"ApplicationError","instance":{"name":"ApplicationError","message":"Login Failed"}}';
    const theError = new ApplicationError("Login Failed");

    nock(LOCALHOST).post(AUTH, MOCK_COMMAND_STRING).reply(403, errorString);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mock = events.emitError(Arg.any()) as any;

    mock.returns();

    serialiser.serialise(command).returns(MOCK_COMMAND_STRING);

    serialiser.unSerialise(errorString).returns(theError);

    await dispatcher.dispatch(command);
    session.didNotReceive().setCurrentUserFromHttpResponse(Arg.any());
    events.received().emitError(theError);
    events.didNotReceive().emitEvent(Arg.any());
  });
});
