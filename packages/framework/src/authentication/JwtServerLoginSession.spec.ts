import { JWT_TOKEN_NAME, USER_COOKIE_NAME } from "../constants";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "../keys";

import { IncomingMessage } from "http";
import JwtServerLoginSession from "./JwtServerLoginSession";
import { Logger } from "@planv7/application";
import { Substitute } from "@fluffy-spoon/substitute";
import { User } from "@planv7/domain";
import { sign } from "jsonwebtoken";

const signUser = async (user: User, key: string): Promise<string> => {
  return new Promise<string>((accept, reject): void =>
    sign(
      { ...user },
      key,
      { algorithm: "RS256" },
      (error: Error | null, token: string | undefined): void => {
        if (error) {
          reject(error);
        } else {
          accept(token);
        }
      }
    )
  );
};

describe("JwtServerLoginSession", (): void => {
  it("Returns no user if the request doesn't contain a token", async (): Promise<
    void
  > => {
    const request = Substitute.for<IncomingMessage>();
    const user = new User("foo", "bar", "baz");
    const userString = encodeURIComponent(JSON.stringify(user));

    const headers = {
      cookie: `${USER_COOKIE_NAME}=${userString}`,
    };

    if (request.headers.returns) {
      request.headers.returns(headers);
    }

    const logger = Substitute.for<Logger>();

    const serverSession = new JwtServerLoginSession(
      request,
      TEST_PUBLIC_KEY,
      logger
    );

    expect(await serverSession.getCurrentUser()).toBeUndefined();
  });

  it("Returns no user if the token is not valid", async (): Promise<void> => {
    const request = Substitute.for<IncomingMessage>();
    const user = new User("foo", "bar", "baz");
    const userString = encodeURIComponent(JSON.stringify(user));
    const token = encodeURIComponent(
      `${await signUser(user, TEST_PRIVATE_KEY)}string to make token invalid`
    );

    const headers = {
      cookie: `${JWT_TOKEN_NAME}=${token}; ${USER_COOKIE_NAME}=${userString}`,
    };

    if (request.headers.returns) {
      request.headers.returns(headers);
    }

    const logger = Substitute.for<Logger>();

    const serverSession = new JwtServerLoginSession(
      request,
      TEST_PUBLIC_KEY,
      logger
    );

    expect(await serverSession.getCurrentUser()).toBeUndefined();
  });

  it("Returns the correct user if token is valid", async (): Promise<void> => {
    const request = Substitute.for<IncomingMessage>();
    const user = new User("foo", "bar", "baz");
    const token = encodeURIComponent(await signUser(user, TEST_PRIVATE_KEY));

    const headers = { cookie: `${JWT_TOKEN_NAME}=${token}` };

    if (request.headers.returns) {
      request.headers.returns(headers);
    }

    const logger = Substitute.for<Logger>();

    const serverSession = new JwtServerLoginSession(
      request,
      TEST_PUBLIC_KEY,
      logger
    );

    const decodedUser = await serverSession.getCurrentUser();

    expect(decodedUser).not.toBeUndefined();

    if (decodedUser) {
      expect(decodedUser.getEmail()).toEqual(user.getEmail());
      expect(decodedUser.getName()).toEqual(user.getName());
    }
  });
});
