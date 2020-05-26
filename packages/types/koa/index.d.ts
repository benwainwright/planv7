import { Container } from "inversify";
import { ResponseAuthHeader } from "@planv7/framework";

declare module "koa" {
  interface BaseContext {
    authHeader: ResponseAuthHeader;
    container: Container;
  }
  interface Context {
    authHeader: ResponseAuthHeader;
    container: Container;
  }
}
