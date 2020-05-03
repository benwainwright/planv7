import WS from "jest-websocket-mock";

import { Command , Serializable } from "@planv5/domain/ports";
import { WAIT_TIMEOUT, WebsocketClient } from "./WebsocketClient";
import { DomainEvent , Serialiser } from "@planv5/domain";


import { EventEmitterWrapper, Logger } from "@planv5/application/ports";
import { Substitute } from "@fluffy-spoon/substitute";

describe("Websocket client", () => {
  let server: any;

  beforeEach(() => {
    server = new WS("ws://localhost:2314", { jsonProtocol: true });
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

    foobar: string;
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

    foo: string;
  }

  const mockCommand = {
    $: "MockCommand",
    instance: {
      foo: "bar",
      handled: false
    }
  };

  it("Emits an event on the attached eventemitter when it receives an error", async done => {
    class MockError extends Error implements Serializable {
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
      $: "MockError",
      instance: {
        message: "foo"
      }
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

  it("Emits an event on the attached eventemitter when it receives a domainevent", async done => {
    const logger = Substitute.for<Logger>();
    const events = new EventEmitterWrapper(logger);
    const socketDispatch = new WebsocketClient(
      "ws://localhost:2314",
      events,
      new Serialiser({ MockCommand, MockEvent }),
      logger
    );
    const mockEventObject = {
      $: "MockEvent",
      instance: {
        outcome: 0,
        foobar: "baz"
      }
    };

    await socketDispatch.openSocketIfNotOpen();

    const json = JSON.stringify(mockEventObject);

    events.onEvent<DomainEvent>((event: MockEvent) => {
      expect(event).toBeDefined();
      expect(event.foobar).toEqual("baz");
      done();
    });

    server.send(json);
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
      await new Promise(resolve => setTimeout(resolve, WAIT_TIMEOUT + 1000));
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
