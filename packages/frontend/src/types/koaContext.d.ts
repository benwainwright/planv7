import Koa, { Context, Next } from "koa";
import { Container } from "inversify";
import { RouterContext } from "koa-router";
import { ResponseAuthHeader } from "@planv5/framework";

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
