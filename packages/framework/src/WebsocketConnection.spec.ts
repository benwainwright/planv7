import WebSocket from "ws";
import deepEqual from "deep-equal";
import { DOMAIN_TYPES, DomainError , DomainEvent, Serialiser } from "@planv5/domain";
import { EventEmitterWrapper , Logger } from "@planv5/application/ports";
import { Command, CommandBus } from "@planv5/domain/ports";


import { Container } from "inversify";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { WebsocketConnection } from "./websocketConnection";

describe("Websocket connection", () => {
  class MockEvent extends DomainEvent {
    public getUserMessage(): string | undefined {
      return "foo";
    }

    public identifier(): string {
      return "MockEvent";
    }

    foobar: string;
  }

  test.todo("Rejects connections with different Origin header");
  test.todo("Disconnects clients when token has expired");

  it("Handles events by replying to the client", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    const events = new EventEmitterWrapper(logger);

    const mockCommandBus = Substitute.for<CommandBus>();

    container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .toConstantValue(mockCommandBus);

    const socket = Substitute.for<WebSocket>();
    socket.send(Arg.all()).returns();

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
      instance: { outcome: 0, foobar: "yes" }
    };

    socket.received().send(
      Arg.is(x => {
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

  it("Unserialises commands and passes them into a command bus", done => {
    const container = new Container();

    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }

      foo: string;
    }

    const mockCommand = {
      $: "MockCommand",
      instance: {
        handled: false,
        foo: "bar"
      }
    };

    const mockCommandBus = Substitute.for<CommandBus>();

    container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .toConstantValue(mockCommandBus);

    const expected = new MockCommand();
    expected.foo = "bar";

    mockCommandBus.execute(expected).returns();

    const logger = Substitute.for<Logger>();

    const server = new WebSocket.Server({ port: 7289 });

    server.on("connection", (socket: WebSocket) => {
      new WebsocketConnection(
        socket,
        mockCommandBus,
        new Serialiser({
          MockCommand
        }),
        new EventEmitterWrapper(logger),
        logger
      );

      socket.on("message", () => {
        mockCommandBus.received().execute(Arg.is(x => deepEqual(x, expected)));
        server.close();
        done();
      });

      socket.emit("message", JSON.stringify(mockCommand));
    });

    setImmediate(() => {
      const address = server.address() as WebSocket.AddressInfo;
      new WebSocket(`ws://[${address.address}]:${address.port}`);
    });
  });

  it("Should return domainerrors to the websocket client", async done => {
    const container = new Container();

    const mockCommandBus = {
      execute: jest.fn()
    };

    class MockCommand extends Command {
      public identifier(): string {
        return "MockCommand";
      }

      foo: string;
    }

    mockCommandBus.execute.mockImplementation(
      async (): Promise<void> => {
        throw new DomainError("foobar");
      }
    );

    container
      .bind<CommandBus>(DOMAIN_TYPES.CommandBus)
      .toConstantValue(mockCommandBus);

    const server = new WebSocket.Server({ port: 7289 });
    server.on("connection", (socket: WebSocket) => {
      const logger = Substitute.for<Logger>();
      new WebsocketConnection(
        socket,
        mockCommandBus,
        new Serialiser({
          MockCommand,
          DomainError
        }),
        new EventEmitterWrapper(logger),
        logger
      );

      const mockCommand = {
        $: "MockCommand",
        instance: {
          handled: false,
          foo: "bar"
        }
      };

      socket.emit("message", JSON.stringify(mockCommand));
    });

    setImmediate(() => {
      const address = server.address() as WebSocket.AddressInfo;
      const client = new WebSocket(`ws://[${address.address}]:${address.port}`);

      client.on("message", (data: WebSocket.Data) => {
        const expectedError = {
          $: "DomainError",
          instance: {
            message: "foobar"
          }
        };
        const returnedObject = JSON.parse(data as string);
        expect(returnedObject).toEqual(expectedError);
        server.close();
        done();
      });
    });
  });
});
