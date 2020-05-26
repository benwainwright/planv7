import { Container } from "inversify";
import { ResponseAuthHeader } from "@planv7/framework";

export default interface AppContext {
  authHeader: ResponseAuthHeader;
  container: Container;
}
