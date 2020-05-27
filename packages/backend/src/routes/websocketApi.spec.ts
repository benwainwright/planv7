/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */

import { TYPES as APP, Logger, Serialiser } from "@planv7/application";
import { AddressInfo } from "net";
import AppContext from "../AppContext";
import { Container } from "inversify";
import Koa from "koa";
import { Substitute } from "@fluffy-spoon/substitute";
import WebSocket from "ws";

import websocketApi from "./websocketApi";

describe("Data api route configuration", () => {
  it("Should result in an available websocket route", async (done) => {
    const container = new Container();

    container.bind<Serialiser>(Serialiser).toConstantValue(new Serialiser({}));

    const koaApp = new Koa<Koa.DefaultState, AppContext>();
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

  test.todo("Should reject connections without an authentication token");
  test.todo("Should authenticate users with a valid JWT token cookie");
});
