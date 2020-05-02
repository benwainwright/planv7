import { User } from "@planv5/domain";
import { AxiosResponse } from "axios";

export interface CurrentLoginSession {
  /**
   * Get the currently logged in user
   */
  getCurrentUser(): User | undefined;

  setCurrentUserFromHttpResponse(response: AxiosResponse): void;
}
