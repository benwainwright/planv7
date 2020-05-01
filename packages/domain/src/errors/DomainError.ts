import { Serializable } from "../ports/serializable";

export const DOMAIN_ERROR = "DomainError";

export class DomainError extends Error implements Serializable {
  constructor(message: string) {
    super(message);
  }

  public identifier(): string {
    return DOMAIN_ERROR;
  }
}
