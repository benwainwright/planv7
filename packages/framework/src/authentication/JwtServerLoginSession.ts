import "reflect-metadata";

import { TYPES as APP, Logger } from "@planv7/application";
import { inject, injectable, optional } from "inversify";

import { AxiosResponse } from "axios";
import Cookies from "./Cookies";
import { IncomingMessage } from "http";
import { JWT_TOKEN_NAME } from "../constants";
import JwtLoginSession from "./JwtLoginSession";
import TYPES from "../TYPES";
import { User } from "@planv7/domain";

@injectable()
export default class JwtServerLoginSession extends JwtLoginSession {
  private readonly privateKey: string;
  private readonly token: string | null = null;
  private currentUser: User | null = null;

  public constructor(
    @optional()
    @inject(IncomingMessage)
    request: IncomingMessage | undefined,
    @inject(TYPES.jwtPrivateKey)
    privateKey: string,
    @inject(APP.logger) logger: Logger
  ) {
    super(logger);
    this.privateKey = privateKey;
    if (request) {
      const cookies = request.headers["cookie"];

      if (cookies) {
        const token = Cookies.get(cookies, JWT_TOKEN_NAME);

        if (token) {
          this.token = token;
        }
      }
    }
  }

  public getCurrentUser(): User | null {
    if (!this.currentUser && this.token && this.privateKey) {
      this.currentUser = this.verifyAndDecodeToken(this.token, this.privateKey);
    }
    return this.currentUser;
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setCurrentUserFromHttpResponse(response: AxiosResponse): void {
    // Noop
  }
}
