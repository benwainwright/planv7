import { AxiosResponse } from "axios";
import { CurrentLoginSession } from "@choirpractise/application";
import { User } from "@choirpractise/domain";

export default class SimpleCurrentUserSession implements CurrentLoginSession {
  private user: User;

  public constructor(user: User) {
    this.user = user;
  }

  public getCurrentUser(): User | undefined {
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
