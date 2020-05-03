import { JwtLoginSession } from "./JwtLoginSession";
import { JWT_TOKEN_NAME } from "../constants";
import { AxiosResponse } from "axios";
import "reflect-metadata";
import { User } from "@planv5/domain";
import { Cookies } from "./Cookies";
import { APP_TYPES, Logger } from "@planv5/application/ports";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";
import { inject, injectable, optional } from "inversify";
import { IncomingMessage } from "http";

@injectable()
export class JwtServerLoginSession extends JwtLoginSession {
  private readonly privateKey: string;
  private readonly token: string | undefined;
  private currentUser: User | undefined;

  public constructor(
    @optional()
    @inject(IncomingMessage)
    request: IncomingMessage | undefined,
    @inject(FRAMEWORK_TYPES.JwtPrivateKey)
    privateKey: string,
    @inject(APP_TYPES.Logger) logger: Logger
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

  public getCurrentUser(): User | undefined {
    if (!this.currentUser && this.token && this.privateKey) {
      this.currentUser = this.verifyAndDecodeToken(this.token, this.privateKey);
    }
    return this.currentUser;
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  public setCurrentUserFromHttpResponse(response: AxiosResponse): void {
    // Noop
  }
}
