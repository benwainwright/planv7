import { User } from "@planv7/domain";

export default interface LoginProvider {
  /**
   * Create a new login session
   *
   * @param username
   * @param password
   */
  login: (username: string, password: string) => Promise<User | null>;
}
