import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { mock as mockExtended } from "jest-mock-extended";
import {
  Command,
  CommandBus,
  TYPES as DOMAIN,
  DomainError,
  DomainEvent,
  Serialisable,
} from "@planv7/domain";
import { EventEmitterWrapper, Logger, Serialiser } from "@planv7/application";

import { Container } from "inversify";
import WebSocket from "ws";
import WebsocketConnection from "./WebsocketConnection";
import deepEqual from "deep-equal";

describe("Websocket connection", () => {
  class MockEvent extends DomainEvent {
    public getUserMessage(): string | undefined {
      return "foo";
    }

    public identifier(): string {
      return "MockEvent";
    }

    public foobar = "";
  }

  test.todo("Rejects connections with different Origin header");
  test.todo("Disconnects clients when token has expired");

  it("Handles events by replying to the client", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    const events = new EventEmitterWrapper(logger);

    const mockCommandBus = Substitute.for<CommandBus>();

    container
      .bind<CommandBus>(DOMAIN.commandBus)
      .toConstantValue(mockCommandBus);

    const socket = Substitute.for<WebSocket>();
    socket.send(Arg.all()).returns();

    // eslint-disable-next-line no-new
    new WebsocketConnection(
      socket,
      mockCommandBus,
      new Serialiser({}),
      events,
      logger
    );

    const newEvent = new MockEvent();
    newEvent.foobar = "yes";
    events.emitEvent(newEvent);

    const expected = {
      $: "MockEvent",
      instance: { outcome: 0, foobar: "yes" },
    };

    socket.received().send(
      Arg.is((x) => {
        const received = JSON.parse(x);
        return deepEqual(expected, received);
      }),
      // This function doesn't need a second argument
      // but for some reason the compiler thinks it does
      // when I use it with a mock, so this Arg.any() is
      // a hack to overcome that
      Arg.any()
    );
  });

  it("Unserialises commands and passes them into a command bus", (done) => {
    const container = new Container();

    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }

      public foo = "";
    }

    const mockCommand = {
      $types: { "": "MockCommand" },
      handled: false,
      foo: "bar",
    };

    const mockCommandBus = Substitute.for<CommandBus>();

    container
      .bind<CommandBus>(DOMAIN.commandBus)
      .toConstantValue(mockCommandBus);

    const expected = new MockCommand();
    expected.foo = "bar";

    mockCommandBus.execute(expected).returns();

    const logger = Substitute.for<Logger>();

    const server = new WebSocket.Server({ port: 7289 });

    server.on("connection", (socket: WebSocket) => {
      // eslint-disable-next-line no-new
      new WebsocketConnection(
        socket,
        mockCommandBus,
        new Serialiser({
          MockCommand,
        }),
        new EventEmitterWrapper(logger),
        logger
      );

      socket.on("message", () => {
        mockCommandBus
          .received()
          .execute(Arg.is((x) => deepEqual(x, expected)));
        server.close();
        done();
      });

      socket.emit("message", JSON.stringify(mockCommand));
    });

    setImmediate(() => {
      const address = server.address() as WebSocket.AddressInfo;
      // eslint-disable-next-line no-new
      new WebSocket(`ws://[${address.address}]:${address.port}`);
    });
  });

  const asMock = <T>(thing: any) => {
    return (thing as unknown) as T;
  };

  it("Should return domainerrors to the websocket client", async () => {
    const container = new Container();

    const mockCommandBus = {
      execute: jest.fn(),
    };

    const theError = new DomainError("foobar");

    mockCommandBus.execute.mockRejectedValue(theError);

    container
      .bind<CommandBus>(DOMAIN.commandBus)
      .toConstantValue(mockCommandBus);

    const socket = {
      send: jest.fn(),
      on: jest.fn(),
    };

    const logger = mockExtended<Logger>();
    const mockCommand = mockExtended<Serialisable>();
    mockCommand.toString = jest.fn();
    (mockCommand.toString as jest.Mock).mockReturnValue("string");

    const serialiser = {
      serialise: jest.fn(),
      unSerialise: jest.fn(),
    };

    serialiser.serialise.mockReturnValue("foobar");
    serialiser.unSerialise.mockReturnValue(mockCommand);

    const events = mockExtended<EventEmitterWrapper>();

    const connection = new WebsocketConnection(
      asMock<WebSocket>(socket),
      mockCommandBus,
      asMock<Serialiser>(serialiser),
      events,
      logger
    );

    await connection.onMessage("foo");

    expect(serialiser.serialise).toHaveBeenCalledWith(theError);
    expect(socket.send).toHaveBeenCalledWith("foobar");
  });
});
