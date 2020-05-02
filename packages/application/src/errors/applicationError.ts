import { Serializable } from "@planv5/domain/ports";

export class ApplicationError extends Error implements Serializable {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  public identifier(): string {
    return "ApplicationError";
  }
}
