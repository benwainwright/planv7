import { Container } from "inversify";
import { ResponseAuthHeader } from "@choirpractise/framework";

export default interface AppContext {
  authHeader: ResponseAuthHeader;
  container: Container;
}
