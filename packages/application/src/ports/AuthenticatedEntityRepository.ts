import { Repository } from "./repository";
import { User } from "@planv5/domain/entities";

export default interface AuthenticatedEntityRepository<T>
  extends Repository<T> {
  getAllByUser: (user: User) => Promise<T[]>;
  getByFieldAndUser: <V>(
    user: User,
    name: string,
    value: V
  ) => Promise<T | undefined>;
}
