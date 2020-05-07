import { Command, DomainEvent, Serialisable } from "@planv7/domain";
import { EventEmitterWrapper, Logger, Serialiser } from "@planv7/application";

import { Substitute } from "@fluffy-spoon/substitute";
import WS from "jest-websocket-mock";
import WebsocketClient from "./WebsocketClient";

const THOUSAND_MILLISECONDS_IN_SECOND = 1000;

describe("Websocket client", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable fp/no-let */
  let server: WS;
  /* eslint-enable fp/no-let */
  /* eslint-enable @typescript-eslint/no-explicit-any */

  beforeEach(() => {
    server = new WS("ws://localhost:2314");
  });

  afterEach(async () => {
    WS.clean();
    server.close();
    await server.closed;
  });

  class MockEvent extends DomainEvent {
    public getUserMessage(): string | undefined {
      return "foo";
    }
    public identifier(): string {
      return "MockEvent";
    }

    public foobar = "";
  }

  class MockCommand extends Command {
    public identifier(): string {
      return "MockCommand";
    }

    public shouldContinueHandling(): boolean {
      return !this.handled;
    }

    public markHandlingComplete(): void {
      this.handled = true;
    }

    public markHandlingIncomplete(): void {
      this.handled = false;
    }

    public foo = "";
  }

  const mockCommand = {
    $types: {
      "": "MockCommand",
    },
    $: {
      foo: "bar",
      handled: false,
    },
  };

  it("Emits an event on the attached eventemitter when it receives an error", async (done) => {
    class MockError extends Error implements Serialisable {
      public constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
      }

      public identifier(): string {
        return "MockError";
      }
    }

    const logger = Substitute.for<Logger>();

    const events = new EventEmitterWrapper(logger);
    const socketDispatch = new WebsocketClient(
      "ws://localhost:2314",
      events,
      new Serialiser({ MockCommand, MockEvent, MockError }),
      logger
    );
    const mockEventObject = {
      $types: {
        "": "MockError",
      },
      message: "foo",
    };

    await socketDispatch.openSocketIfNotOpen();

    const json = JSON.stringify(mockEventObject);

    events.onError<MockError>((error: MockError) => {
      expect(error).toBeDefined();
      expect(error.message).toEqual("foo");
      done();
    });

    server.send(json);
  });

  it("Emits an event on the attached eventemitter when it receives a domainevent", async () => {
    const logger = Substitute.for<Logger>();
    const events = new EventEmitterWrapper(logger);
    const serialiser = new Serialiser({ MockCommand, MockEvent });
    const socketDispatch = new WebsocketClient(
      "ws://localhost:2314",
      events,
      serialiser,
      logger
    );

    await socketDispatch.openSocketIfNotOpen();

    const event = new MockEvent();

    event.foobar = "baz";
    const json = serialiser.serialise(event);

    const firedEvents: MockEvent[] = [];

    events.onEvent<MockEvent>((event: MockEvent) => {
      firedEvents.push(event);
    });

    server.send(json);
    expect(firedEvents.length).toEqual(1);
    expect(firedEvents[0].foobar).toEqual("baz");
  });

  describe("dispatch", () => {
    it("Serialises the command and sends it to the socket", async () => {
      const logger = Substitute.for<Logger>();
      const events = new EventEmitterWrapper(logger);
      const socketDispatch = new WebsocketClient(
        "ws://localhost:2314",
        events,
        new Serialiser({ MockCommand, MockEvent }),
        logger
      );
      const command = new MockCommand();
      command.foo = "bar";
      await socketDispatch.dispatch(command);
      await expect(server).toReceiveMessage(mockCommand);
    });

    it("Uses a single connection for multiple dispatches", async () => {
      const logger = Substitute.for<Logger>();
      const events = new EventEmitterWrapper(logger);
      const socketDispatch = new WebsocketClient(
        "ws://localhost:2314",
        events,
        new Serialiser({ MockCommand, MockEvent }),
        logger
      );

      let connections = 0;

      server.on("connection", () => {
        connections++;
      });

      const command = new MockCommand();
      await socketDispatch.dispatch(command);
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          WebsocketClient.waitTimeout + THOUSAND_MILLISECONDS_IN_SECOND
        )
      );
      await socketDispatch.dispatch(command);
      expect(connections).toEqual(1);
    });

    // It("Still manages to send the message after an error", async () => {
    //   const events = new EventEmitterWrapper();
    //   const socketDispatch = new WebsocketClient(
    //     "ws://localhost:2314",
    //     events,
    //     { MockCommand },
    //     { MockEvent },
    //     Substitute.for<Logger>()
    //   );

    //   const command = new MockCommand();
    //   command.foo = "bar2";
    //   await socketDispatch.dispatch(command);
    //   server.error();
    //   server = new WS("ws://localhost:2314", { jsonProtocol: true });

    //   const command2 = new MockCommand();
    //   command2.foo = "bar";
    //   await socketDispatch.dispatch(command2);
    //   await expect(server).toReceiveMessage(mockCommand);
    // });
  });
});
