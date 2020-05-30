import {
  CommandOutcome,
  User,
  UserLoginStateChangeEvent,
} from "@choirpractise/domain";
import { EventEmitterWrapper, Logger } from "@choirpractise/application";
import { JWT_TOKEN_NAME, USER_COOKIE_NAME } from "../constants";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "../keys";

import { AxiosResponse } from "axios";
import Cookies from "./Cookies";
import JwtClientLoginSession from "./JwtClientLoginSession";
import { Substitute } from "@fluffy-spoon/substitute";
import WebsocketClient from "../WebsocketClient";
import { sign } from "jsonwebtoken";

const signUser = async (user: User, key: string): Promise<string> => {
  return new Promise<string>((resolve, reject): void =>
    sign(
      { ...user },
      key,
      { algorithm: "RS256" },
      (error: Error | null, token: string | undefined): void => {
        if (error || !token) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    )
  );
};

describe("JwtLocalStorageCurrentLoginSession", (): void => {
  beforeEach((): void => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const equalsPosition = cookie.indexOf("=");
      const name =
        equalsPosition > -1 ? cookie.slice(0, equalsPosition) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  });

  it("Gets the token from the authorisation header when supplied with an AxiosResponse", (): void => {
    const logger = Substitute.for<Logger>();
    const emitter = new EventEmitterWrapper(logger);
    const response = Substitute.for<AxiosResponse>();
    const client = Substitute.for<WebsocketClient>();
    const headers = { authorization: "Bearer foobar" };
    response.headers.returns(headers);

    const session = new JwtClientLoginSession(
      emitter,
      TEST_PUBLIC_KEY,
      logger,
      client
    );

    session.setCurrentUserFromHttpResponse(response);

    expect(session.getToken()).toEqual("foobar");
  });

  it("Returns no user if there is no token cookie", (): void => {
    const logger = Substitute.for<Logger>();
    const client = Substitute.for<WebsocketClient>();
    const emitter = new EventEmitterWrapper(logger);
    const session = new JwtClientLoginSession(
      emitter,
      TEST_PUBLIC_KEY,
      logger,
      client
    );
    const event = new UserLoginStateChangeEvent(
      CommandOutcome.SUCCESS,
      new User("foo", "bar", "baz")
    );
    emitter.emitEvent(event);

    expect(session.getCurrentUser()).toBeUndefined();
  });

  it("Returns a user if there is a token", async (): Promise<void> => {
    const logger = Substitute.for<Logger>();
    const emitter = new EventEmitterWrapper(logger);
    const user = new User("foo", "bar", "foobar");

    const token = await signUser(user, TEST_PRIVATE_KEY);
    const headers = { authorization: `Bearer ${token}` };

    const response = Substitute.for<AxiosResponse>();
    response.headers.returns(headers);
    const client = Substitute.for<WebsocketClient>();
    const session = new JwtClientLoginSession(
      emitter,
      TEST_PUBLIC_KEY,
      logger,
      client
    );

    session.setCurrentUserFromHttpResponse(response);

    expect(session.getToken()).toEqual(token);
    expect(session.getCurrentUser()).toEqual(expect.objectContaining(user));
  });

  it("Gets data from cookies when requested", async (): Promise<void> => {
    const logger = Substitute.for<Logger>();
    const emitter = new EventEmitterWrapper(logger);
    const client = Substitute.for<WebsocketClient>();
    const session = new JwtClientLoginSession(
      emitter,
      TEST_PUBLIC_KEY,
      logger,
      client
    );

    const user = new User("foo", "b;ar", "foobar");
    const token = await signUser(user, TEST_PRIVATE_KEY);

    Cookies.set(JWT_TOKEN_NAME, token, 100);

    const returnedUser = session.getCurrentUser();

    expect(returnedUser).toBeDefined();

    if (returnedUser) {
      expect(returnedUser.getEmail()).toEqual(user.getEmail());
      expect(returnedUser.getName()).toEqual(user.getName());
    }
  });

  it("Clears the current user from storage when requested", async (): Promise<
    void
  > => {
    const logger = Substitute.for<Logger>();
    const emitter = new EventEmitterWrapper(logger);
    const event = Substitute.for<UserLoginStateChangeEvent>();
    const client = Substitute.for<WebsocketClient>();
    const user = new User("foo", "bar", "foobar");

    const token = await signUser(user, TEST_PRIVATE_KEY);
    const headers = { authorization: `Bearer ${token}` };
    const response = Substitute.for<AxiosResponse>();
    response.headers.returns(headers);
    event.getUser().returns(user);
    event.getOutcome().returns(CommandOutcome.SUCCESS);

    const session = new JwtClientLoginSession(
      emitter,
      TEST_PUBLIC_KEY,
      logger,
      client
    );
    session.setCurrentUserFromHttpResponse(response);
    await session.killSession();
    expect(Cookies.get(document.cookie, USER_COOKIE_NAME)).toEqual("");
    expect(Cookies.get(document.cookie, JWT_TOKEN_NAME)).toEqual("");
    expect(session.getCurrentUser()).toBeUndefined();
    expect(session.getToken()).toEqual("");
  });
});
