import { Container } from "inversify";
import { ResponseAuthHeader } from "@choirpractise/framework";
import * as ws from "ws";

declare module "koa" {
  interface BaseContext {
    authHeader: ResponseAuthHeader;
    container: Container;
  }
  interface Context {
    authHeader: ResponseAuthHeader;
    container: Container;
    websocket: ws;
  }
}
