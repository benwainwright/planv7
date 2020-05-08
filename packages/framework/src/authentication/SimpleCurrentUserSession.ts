import { AxiosResponse } from "axios";
import { CurrentLoginSession } from "@planv7/application";
import { User } from "@planv7/domain";

export default class SimpleCurrentUserSession implements CurrentLoginSession {
  private user: User;

  public constructor(user: User) {
    this.user = user;
  }

  public getCurrentUser(): User | null {
    return this.user;
  }

  public setCurrentUser(user: User): void {
    this.user = user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setCurrentUserFromHttpResponse(response: AxiosResponse): void {
    throw new Error("Not implemented");
  }
}
