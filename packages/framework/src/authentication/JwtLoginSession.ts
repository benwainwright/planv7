import { CurrentLoginSession, Logger, TYPES } from "@choirpractise/application";
import { inject, injectable } from "inversify";

import { AxiosResponse } from "axios";
import { User } from "@choirpractise/domain";
import { verify } from "jsonwebtoken";

@injectable()
export default abstract class JwtLoginSession implements CurrentLoginSession {
  private readonly logger: Logger;

  protected constructor(@inject(TYPES.logger) logger: Logger) {
    this.logger = logger;
  }

  public abstract getCurrentUser(): User | undefined;
  public abstract setCurrentUser(user: User): void;
  public abstract setCurrentUserFromHttpResponse(response: AxiosResponse): void;

  public verifyAndDecodeToken(token: string, key: string): User | undefined {
    try {
      const decoded = verify(token, key, { algorithms: ["RS256"] });
      const user = new User("", "", "");
      Object.assign(user, decoded);
      return user;
    } catch (error) {
      this.logger.debug(`Failed to verify token: ${error}`);
      return undefined;
    }
  }
}
