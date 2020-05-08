import { Substitute } from "@fluffy-spoon/substitute";
import { APP_TYPES, Logger } from "@planv5/application/ports";
import { ResponseAuthHeader } from "@planv5/framework";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";

import Koa, { Context, Next } from "koa";
import { prepareHttpRequest } from "./http";
import { IncomingMessage } from "http";
import { Container } from "inversify";

describe("Http middleware", () => {
  it("Attaches a child container to the request", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
    const context = {} as Context;
    const next = jest.fn();

    const middleware = prepareHttpRequest(container);

    middleware(context as Context, next as Next);

    expect(context.container).toBeInstanceOf(Container);
    expect(context.container).not.toEqual(container);
    expect(context.container.parent).toEqual(container);
  });

  it("Binds the HTTP request to the child container", done => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);

    const context = {
      req: {}
    } as Context;

    const next = async (): Promise<any> => {
      const request = context.container.get(IncomingMessage);
      expect(request).toEqual({});
      done();
    };

    const middleware = prepareHttpRequest(container);

    middleware(context as Context, next);

    expect(() => container.get(IncomingMessage)).toThrowError();
  });

  it("Binds a new response auth header to the child container", done => {
    const container = new Container();
    const context = {} as Context;
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);

    const middleware = prepareHttpRequest(container);

    const next = async (): Promise<any> => {
      const header = context.container.get<ResponseAuthHeader>(
        FRAMEWORK_TYPES.ResponseAuthHeader
      );
      expect(header).toBeInstanceOf(ResponseAuthHeader);
      done();
    };

    middleware(context as Context, next as Next);

    expect(() =>
      container.get<ResponseAuthHeader>(FRAMEWORK_TYPES.ResponseAuthHeader)
    ).toThrowError();
  });

  it("Calls the next function", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
    const context: any = {};
    const next = jest.fn();

    const middleware = prepareHttpRequest(container);

    middleware(context, next as Next);

    expect(next).toBeCalled();
  });
});
