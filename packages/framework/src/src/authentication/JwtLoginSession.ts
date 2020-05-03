import { User } from "@planv5/domain";
import { verify } from "jsonwebtoken";
import { AxiosResponse } from "axios";
import { inject, injectable } from "inversify";
import { APP_TYPES, CurrentLoginSession , Logger } from "@planv5/application/ports";


@injectable()
export abstract class JwtLoginSession implements CurrentLoginSession {
  private readonly logger: Logger;

  protected constructor(@inject(APP_TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  public abstract getCurrentUser(): User | undefined;
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
