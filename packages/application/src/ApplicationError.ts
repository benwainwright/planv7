import { Serialisable } from "@choirpractise/domain";

export default class ApplicationError extends Error implements Serialisable {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public identifier(): string {
    return "ApplicationError";
  }
}
