import Serialisable from "./ports/Serialisable";

export const DOMAIN_ERROR = "DomainError";

export class DomainError extends Error implements Serialisable {
  public constructor(message: string) {
    super(message);
  }

  public identifier(): string {
    return DOMAIN_ERROR;
  }
}
