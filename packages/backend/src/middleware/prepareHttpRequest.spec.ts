import { TYPES as APP, Logger } from "@planv7/application";
import { Context, Next } from "koa";
import { Container } from "inversify";
import { IncomingMessage } from "http";
import { ResponseAuthHeader } from "@planv7/framework";
import { Substitute } from "@fluffy-spoon/substitute";

import prepareHttpRequest from "./prepareHttpRequest";

describe("Http middleware", () => {
  it("Attaches a child container to the request", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);
    const context = {} as Context;
    const next = jest.fn();

    const middleware = prepareHttpRequest(container);

    middleware(context as Context, next as Next);

    expect(context.container).toBeInstanceOf(Container);
    expect(context.container).not.toEqual(container);
    expect(context.container.parent).toEqual(container);
  });

  it("Binds the HTTP request to the child container", (done) => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    const context = {
      req: {},
    } as Context;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = async (): Promise<any> => {
      const request = context.container.get(IncomingMessage);
      expect(request).toEqual({});
      done();
    };

    const middleware = prepareHttpRequest(container);

    middleware(context as Context, next);

    expect(() => container.get(IncomingMessage)).toThrowError();
  });

  it("Binds a new response auth header to the child container", (done) => {
    const container = new Container();
    const context = {} as Context;
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    const middleware = prepareHttpRequest(container);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = async (): Promise<any> => {
      const header = context.container.get(ResponseAuthHeader);
      expect(header).toBeInstanceOf(ResponseAuthHeader);
      done();
    };

    middleware(context as Context, next as Next);

    expect(() => container.get(ResponseAuthHeader)).toThrowError();
  });

  it("Calls the next function", () => {
    const container = new Container();
    const logger = Substitute.for<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const context: any = {};
    const next = jest.fn();

    const middleware = prepareHttpRequest(container);

    middleware(context, next as Next);

    expect(next).toBeCalled();
  });
});
