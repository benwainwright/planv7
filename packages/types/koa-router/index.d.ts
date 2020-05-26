import { Container } from "inversify";
import { ResponseAuthHeader } from "@planv7/framework";

declare module "koa-router" {
  interface RouterContext {
    authHeader: ResponseAuthHeader;
    container: Container;
  }
}
