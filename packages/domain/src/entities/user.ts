import { Serializable } from "../ports/serializable";
export class User implements Serializable {
  private readonly name: string;
  private readonly email: string;
  private readonly password: string;
  private readonly admin: boolean;

  public constructor(
    name: string,
    email: string,
    password: string,
    admin?: boolean
  ) {
    this.password = password;
    this.name = name;
    this.email = email;
    this.admin = admin || false;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public isAdmin(): boolean {
    return this.admin;
  }

  public identifier(): string {
    return "User";
  }

  public toString(): string {
    return `User(name: '${this.name}', email: '${this.email}', admin: '${this.admin}')`;
  }
}
