import Command from "../ports/Command";

/**
 * Register a new user
 */

export default class RegisterUserCommand extends Command {
  private readonly email: string;
  private readonly name: string;
  private readonly password: string;

  public constructor();
  public constructor(name: string, email: string, password: string);
  public constructor(name?: string, email?: string, password?: string) {
    super();
    this.name = name ?? "";
    this.email = email ?? "";
    this.password = password ?? "";
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.name;
  }

  public getPassword(): string {
    return this.password;
  }

  public identifier(): string {
    return "RegisterUserCommand";
  }

  public toString(): string {
    return `${this.identifier()}(name: ${this.name}, email: ${
      this.email
    }, password: ${this.password})`;
  }
}
