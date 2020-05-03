import { AxiosResponse } from "axios";
import { User } from "@planv7/domain";

export default interface CurrentLoginSession {
  /**
   * Get the currently logged in user
   */
  getCurrentUser: () => User | null;

  setCurrentUserFromHttpResponse: (response: AxiosResponse) => void;
}
