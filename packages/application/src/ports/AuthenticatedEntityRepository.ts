import Repository from "./Repository";
import { User } from "@choirpractise/domain";

export default interface AuthenticatedEntityRepository<T>
  extends Repository<T> {
  getAllByUser: (user: User) => Promise<T[]>;
  getByFieldAndUser: <V>(
    user: User,
    name: string,
    value: V
  ) => Promise<T | undefined>;
}
