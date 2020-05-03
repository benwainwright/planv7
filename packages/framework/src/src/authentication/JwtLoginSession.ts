import { verify } from "jsonwebtoken";
import { AxiosResponse } from "axios";
import { inject, injectable } from "inversify";

import { User } from "@planv7/domain";
import { CurrentLoginSession, Logger, TYPES } from "@planv7/application";

@injectable()
export default abstract class JwtLoginSession implements CurrentLoginSession {
  private readonly logger: Logger;

  protected constructor(@inject(TYPES.logger) logger: Logger) {
    this.logger = logger;
  }

  public abstract getCurrentUser(): User | null;
  public abstract setCurrentUser(user: User): void;
  public abstract setCurrentUserFromHttpResponse(response: AxiosResponse): void;

  public verifyAndDecodeToken(token: string, key: string): User | undefined {
    const user = undefined;
    try {
      const decoded = verify(token, key, { algorithms: ["RS256"] });
      const user = new User("", "", "");
      Object.assign(user, decoded);
      return user;
    } catch (e) {
      this.logger.debug(`Failed to verify token: ${e}`);
    }
    return user;
  }
}
