import { AxiosResponse } from "axios";
import { User } from "@choirpractise/domain";

export default interface CurrentLoginSession {
  /**
   * Get the currently logged in user
   */
  getCurrentUser: () => User | undefined;

  setCurrentUserFromHttpResponse: (response: AxiosResponse) => void;
}
