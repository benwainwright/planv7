import { User } from "@planv7/domain";
import { AxiosResponse } from "axios";

export default interface CurrentLoginSession {
  /**
   * Get the currently logged in user
   */
  getCurrentUser: () => User | undefined;

  setCurrentUserFromHttpResponse: (response: AxiosResponse) => void;
}
