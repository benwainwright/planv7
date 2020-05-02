import Serializable from "./ports/Serializable";

export const DOMAIN_ERROR = "DomainError";

export class DomainError extends Error implements Serializable {
  public constructor(message: string) {
    super(message);
  }

  public identifier(): string {
    return DOMAIN_ERROR;
  }
}
