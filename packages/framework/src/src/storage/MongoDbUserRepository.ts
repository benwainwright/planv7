import { FRAMEWORK_TYPES } from "../../types";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Collection, Db } from "mongodb";
import { Repository } from "@planv5/application/ports";
import { User } from "@planv5/domain";
import { genSalt, hash } from "bcryptjs";

export const USERS_COLLECTION_NAME = "users";

@injectable()
export class MongoDbUserRepository implements Repository<User> {
  private readonly collection: Collection;
  public constructor(@inject(FRAMEWORK_TYPES.Db) database: Db) {
    this.collection = database.collection(USERS_COLLECTION_NAME);
  }

  public async getUniqueSlug(identifier: string): Promise<string> {
    return identifier;
  }

  public async saveNew(user: User): Promise<void> {
    return new Promise((resolve, reject): void => {
      genSalt(10, (error: Error, salt: string): void => {
        if (error) {
          reject(error);
        } else {
          hash(
            user.getPassword(),
            salt,
            async (error: Error, hash: string): Promise<void> => {
              if (!error) {
                await this.collection.insertOne({
                  name: user.getName(),
                  email: user.getEmail(),
                  password: hash
                });
                resolve();
              } else {
                reject(error);
              }
            }
          );
        }
      });
    });
  }

  public async deleteExisting(user: User): Promise<void> {
    throw new Error("Not yet implemented");
  }

  public async updateExisting(user: User): Promise<void> {
    throw new Error("Not yet implemented");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getByField<V>(name: string, value: V): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
