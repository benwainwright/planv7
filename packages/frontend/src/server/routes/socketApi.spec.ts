import WebSocket from "ws";
import Koa from "koa";
import { AddressInfo } from "net";
import { Container, inject , injectable } from "inversify";

import {
  APP_TYPES,
  EventEmitterWrapper,
  Logger
} from "@planv5/application/ports";
import { Command, CommandBus, Handler } from "@planv5/domain/ports";
import { UserRegisteredEvent } from "@planv5/domain/events";
import { CommandOutcome, Serialiser, User } from "@planv5/domain";
import { Substitute } from "@fluffy-spoon/substitute";

import { configureDataApi } from "./socketApi";

describe("Data api route configuration", () => {
  it("Should result in an available websocket route", async done => {
    const container = new Container();

    container.bind<Serialiser>(Serialiser).toConstantValue(new Serialiser({}));

    const koaApp = new Koa();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
    configureDataApi(koaApp, logger, container, {});
    const server = koaApp.listen();

    const address = server.address() as AddressInfo;
    const url = `ws://[${address.address}]:${address.port}/data`;

    const socket = new WebSocket(url);
    const OPEN = 1;
    while (socket.readyState !== OPEN) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    socket.close();
    server.close();
    done();
  });

  it("Should emit events to different connections separately", async done => {
    class MockCommand1 extends Command {
      public identifier(): string {
        return "MockCommand1";
      }
      foo: string;
    }

    @injectable()
    class MockHandler implements Handler<MockCommand1> {
      private events: EventEmitterWrapper;

      public constructor(
        @inject(APP_TYPES.EventEmitterWrapper)
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

    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);

    container
      .bind<Serialiser>(Serialiser)
      .toConstantValue(new Serialiser({ MockCommand1, UserRegisteredEvent }));

    configureDataApi(koaApp, logger, container, { MockHandler });
    const server = koaApp.listen();
    koaApp.onerror = (error: Error) => {
      fail(error);
    };
    const address = server.address() as AddressInfo;
    const url = `ws://[${address.address}]:${address.port}/data`;

    const socket1 = new WebSocket(url);
    const socket2 = new WebSocket(url);
    const OPEN = 1;
    while (socket1.readyState !== OPEN) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    while (socket2.readyState !== OPEN) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    const socket1Events: any[] = [];
    const socket2Events: any[] = [];

    const socket1Promise = new Promise(accept => {
      socket1.on("message", (data: any) => {
        const object = JSON.parse(data);
        socket1Events.push(object.instance);
        accept();
      });
    });

    const socket2Promise = new Promise(accept => {
      socket2.on("message", (data: any) => {
        const object = JSON.parse(data);
        socket2Events.push(object.instance);
        accept();
      });
    });

    socket1.onerror = (error: any) => {
      fail(error);
    };

    socket2.onerror = (error: any) => {
      fail(error);
    };

    const mockCommand1 = {
      $: "MockCommand1",
      instance: {
        handled: 0,
        foo: "baz"
      }
    };

    const mockCommand2 = {
      $: "MockCommand1",
      instance: {
        handled: 0,
        foo: "bop"
      }
    };

    socket1.send(JSON.stringify(mockCommand1));
    await socket1Promise;
    expect(socket1Events.length).toEqual(1);
    expect(socket2Events.length).toEqual(0);
    socket2.send(JSON.stringify(mockCommand2));
    await socket2Promise;
    expect(socket1Events.length).toEqual(1);
    expect(socket2Events.length).toEqual(1);
    expect(socket1Events[0].user.instance.name).toEqual("baz");
    expect(socket2Events[0].user.instance.name).toEqual("bop");

    socket1.close();
    socket2.close();
    server.close();
    done();
  });

  test.todo("Should reject connections without an authentication token");
  test.todo("Should authenticate users with a valid JWT token cookie");
});
