import { User } from "../entities/user";

export class GetAllUsersEvent {
  private users: User[];

  public constructor(users: User[]) {
    this.users = users;
  }
  public getUsers(): User[] {
    return this.users;
  }
}
