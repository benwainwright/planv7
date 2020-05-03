import Repository from "./Repository";
import { User } from "@planv7/domain";

export default interface AuthenticatedEntityRepository<T>
  extends Repository<T> {
  getAllByUser: (user: User) => Promise<T[]>;
  getByFieldAndUser: <V>(
    user: User,
    name: string,
    value: V
  ) => Promise<T | null>;
}
