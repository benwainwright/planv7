import { Container } from "inversify";
import { ResponseAuthHeader } from "@choirpractise/framework";

declare module "koa-router" {
  interface RouterContext {
    authHeader: ResponseAuthHeader;
    container: Container;
  }
}
