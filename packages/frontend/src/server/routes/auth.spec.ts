import request from "supertest";
import Koa, { Context, Next } from "koa";
import { Container } from "inversify";
import { auth } from "./auth";
import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { ResponseAuthHeader } from "@planv5/framework";
import { Serialiser, User } from "@planv5/domain";
import { GetAllUsersCommand, LoginCommand } from "@planv5/domain/commands";
import { APP_TYPES, Logger , LoginProvider } from "@planv5/application/ports";
import { ApplicationError } from "@planv5/application/errors";

import * as HANDLERS from "@planv5/application/handlers";

describe("Authorisation endpoint", () => {
  it("Calls the next function", async done => {
    const app = new Koa();

    app.use((context: Context, next: Next) => {
      context.container = new Container();
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(Substitute.for<Serialiser>());
      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      next();
    });
    const logger = Substitute.for<Logger>();
    app.use(auth(logger, HANDLERS));
    app.use(() => {
      done();
    });

    const server = app.listen();
    await request(server).get("/auth");
    server.close();
  });

  it("Sends the login to the loginProvider", async () => {
    const app = new Koa();

    const loginProvider = Substitute.for<LoginProvider>();
    const serialiser = Substitute.for<Serialiser>();
    const logger = Substitute.for<Logger>();
    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);
      const command = new LoginCommand("foo", "bar");

      serialiser.unSerialise(Arg.all()).returns(command);

      loginProvider
        .login("foo", "bar")
        .returns(Promise.resolve(new User("foo", "bar", "baz")));

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);

      await next();
    });
    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    await request(server)
      .post("/auth")
      .send({
        $: "LoginCommand",
        instance: {
          username: "foo",
          password: "bar",
          handled: 0
        }
      });
    loginProvider.received().login("foo", "bar");
    server.close();
  });

  it("Responds with 200 if successful", async () => {
    const app = new Koa();
    const serialiser = Substitute.for<Serialiser>();
    const command = new LoginCommand("foo", "bar");
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);

      context.authHeader = new ResponseAuthHeader();

      serialiser.unSerialise(Arg.all()).returns(command);

      loginProvider
        .login("foo", "bar")
        .returns(Promise.resolve(new User("foo", "bar", "baz")));

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);
      await next();
    });

    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    await request(server)
      .post("/auth")
      .send({
        $: "LoginCommand",
        instance: {
          username: "foo",
          password: "bar",
          handled: 0
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);
    server.close();
  });

  it("Adds the token to successful responses", async () => {
    const app = new Koa();
    const serialiser = Substitute.for<Serialiser>();
    const command = new LoginCommand("foo", "bar");
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);

      context.authHeader = new ResponseAuthHeader();
      context.authHeader.setHeader("foo");

      serialiser.unSerialise(Arg.all()).returns(command);

      loginProvider
        .login("foo", "bar")
        .returns(Promise.resolve(new User("foo", "bar", "baz")));

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);

      await next();
    });

    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    const response = await request(server)
      .post("/auth")
      .send({
        $: "LoginCommand",
        instance: {
          username: "foo",
          password: "bar",
          handled: 0
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.header["authorization"]).toEqual("Bearer foo");
    server.close();
  });

  it("Responds with 403 if not successful", async () => {
    const app = new Koa();
    const serialiser = Substitute.for<Serialiser>();
    const command = new LoginCommand("foo", "bar");
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);

      context.authHeader = new ResponseAuthHeader();
      context.authHeader.setHeader("foo");
      const theError = new ApplicationError("Whoops");
      loginProvider.login("foo", "bar").returns(Promise.reject(theError));

      serialiser.unSerialise(Arg.all()).returns(command);
      serialiser.serialise(theError).returns('{"foo": "bar"}');

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);

      await next();
    });

    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    const response = await request(server)
      .post("/auth")
      .send({
        $: "LoginCommand",
        instance: {
          username: "foo",
          password: "bar",
          handled: 0
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toEqual(403);
    server.close();
  });

  it("Responds with a 403 if sent a command that is not auth related", async () => {
    const app = new Koa();
    const serialiser = Substitute.for<Serialiser>();
    const command = new GetAllUsersCommand();
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);

      context.authHeader = new ResponseAuthHeader();
      context.authHeader.setHeader("foo");

      serialiser.unSerialise(Arg.all()).returns(command);
      serialiser.serialise(Arg.all()).returns('{"foo": "bar"}');

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);

      await next();
    });

    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    const response = await request(server)
      .post("/auth")
      .send({
        $: "GetAllUsersCommand",
        instance: {
          handled: 0
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    loginProvider.didNotReceive().login(Arg.any(), Arg.any());
    expect(response.status).toEqual(403);
    server.close();
  });

  it("Returns all errors in response body", async () => {
    const app = new Koa();
    const serialiser = Substitute.for<Serialiser>();
    const command = new LoginCommand("foo", "bar");
    const loginProvider = Substitute.for<LoginProvider>();
    const logger = Substitute.for<Logger>();

    app.use(async (context: Context, next: Next) => {
      context.container = new Container();

      const logger = Substitute.for<Logger>();
      context.container.bind<Logger>(APP_TYPES.Logger).toConstantValue(logger);
      context.container
        .bind<Serialiser>(Serialiser)
        .toConstantValue(serialiser);

      context.authHeader = new ResponseAuthHeader();
      context.authHeader.setHeader("foo");

      const theError = new ApplicationError("Whoops");
      loginProvider.login("foo", "bar").returns(Promise.reject(theError));

      serialiser.unSerialise(Arg.all()).returns(command);
      serialiser.serialise(theError).returns('{"foo": "bar"}');

      context.container
        .bind<LoginProvider>(APP_TYPES.LoginProvider)
        .toConstantValue(loginProvider);

      await next();
    });

    app.use(auth(logger, HANDLERS));

    const server = app.listen();
    const response = await request(server)
      .post("/auth")
      .send({
        $: "LoginCommand",
        instance: {
          username: "foo",
          password: "bar",
          handled: 0
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.status).toEqual(403);
    expect(JSON.parse(response.text)).toMatchObject({ foo: "bar" });
    server.close();
  });
});
