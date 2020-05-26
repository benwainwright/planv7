/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TYPES as APP,
  EventEmitterWrapper,
  Logger,
  Serialiser,
} from "@planv7/application";
import {
  Command,
  CommandOutcome,
  Handler,
  User,
  UserRegisteredEvent,
} from "@planv7/domain";
import { Container, inject, injectable } from "inversify";
import { AddressInfo } from "net";
import Koa from "koa";
import { Substitute } from "@fluffy-spoon/substitute";
import WebSocket from "ws";

import websocketApi from "./websocketApi";

describe("Data api route configuration", () => {
  it("Should result in an available websocket route", async (done) => {
    const container = new Container();

    container.bind<Serialiser>(Serialiser).toConstantValue(new Serialiser({}));

    const koaApp = new Koa();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);
    websocketApi(koaApp, logger, container, {});
    const server = koaApp.listen();

    const address = server.address() as AddressInfo;
    const url = `ws://[${address.address}]:${address.port}/data`;

    const socket = new WebSocket(url);
    const OPEN = 1;
    while (socket.readyState !== OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    socket.close();
    server.close();
    done();
  });

  it("Should emit events to different connections separately", async (done) => {
    class MockCommand1 extends Command {
      public identifier(): string {
        return "MockCommand1";
      }
      public foo = "";
    }

    @injectable()
    class MockHandler implements Handler<MockCommand1> {
      private events: EventEmitterWrapper;

      public constructor(
        @inject(APP.eventEmitterWrapper)
        applicationEvents: EventEmitterWrapper
      ) {
        this.events = applicationEvents;
      }

      public getCommandInstance(): MockCommand1 {
        return new MockCommand1();
      }

      public async tryHandle(command: MockCommand1): Promise<void> {
        command.markHandlingComplete();
        const user = new User(command.foo, "bar", "baz");
        const event = new UserRegisteredEvent(CommandOutcome.SUCCESS, user);
        this.events.emitEvent(event);
      }
    }

    const container = new Container();
    const koaApp = new Koa();
    const logger = Substitute.for<Logger>();

    container.bind<Logger>(APP.logger).toConstantValue(logger);

    container
      .bind<Serialiser>(Serialiser)
      .toConstantValue(new Serialiser({ MockCommand1, UserRegisteredEvent }));

    websocketApi(koaApp, logger, container, { MockHandler });
    const server = koaApp.listen();
    koaApp.onerror = (error: Error): void => {
      fail(error);
    };
    const address = server.address() as AddressInfo;
    const url = `ws://[${address.address}]:${address.port}/data`;

    const socket1 = new WebSocket(url);
    const socket2 = new WebSocket(url);
    const OPEN = 1;
    while (socket1.readyState !== OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    while (socket2.readyState !== OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    const socket1Events: any[] = [];
    const socket2Events: any[] = [];

    const socket1Promise = new Promise((resolve) => {
      socket1.on("message", (data: any) => {
        const obj = JSON.parse(data);
        socket1Events.push(obj);
        resolve();
      });
    });

    const socket2Promise = new Promise((resolve) => {
      socket2.on("message", (data: any) => {
        const obj = JSON.parse(data);
        socket2Events.push(obj);
        resolve();
      });
    });

    socket1.onerror = (error: any): void => {
      fail(error);
    };

    socket2.onerror = (error: any): void => {
      fail(error);
    };

    const mockCommand1 = {
      $types: { "": "MockCommand1" },
      handled: 0,
      foo: "baz",
    };

    const mockCommand2 = {
      $types: { "": "MockCommand1" },
      handled: 0,
      foo: "bop",
    };

    socket1.send(JSON.stringify(mockCommand1));
    await socket1Promise;
    expect(socket1Events.length).toEqual(1);
    console.log(socket1Events);
    expect(socket2Events.length).toEqual(0);
    socket2.send(JSON.stringify(mockCommand2));
    await socket2Promise;
    expect(socket1Events.length).toEqual(1);
    expect(socket2Events.length).toEqual(1);
    expect(socket1Events[0].user.name).toEqual("baz");
    expect(socket2Events[0].user.name).toEqual("bop");

    socket1.close();
    socket2.close();
    server.close();
    done();
  });

  test.todo("Should reject connections without an authentication token");
  test.todo("Should authenticate users with a valid JWT token cookie");
});
