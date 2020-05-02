import { Serialisable } from "@planv7/domain";

export class ApplicationError extends Error implements Serialisable {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public identifier(): string {
    return "ApplicationError";
  }
}
