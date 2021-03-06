import "reflect-metadata";

import { Collection, Db } from "mongodb";
import { genSalt, hash as getHash } from "bcryptjs";
import { inject, injectable } from "inversify";

import { Repository } from "@choirpractise/application";
import TYPES from "../TYPES";
import { User } from "@choirpractise/domain";

const SALT_ROUNDS = 10;

@injectable()
export default class MongoDatabaseUserRepository implements Repository<User> {
  public static readonly collectionName = "users";

  private readonly collection: Collection;
  public constructor(@inject(TYPES.db) database: Db) {
    this.collection = database.collection(
      MongoDatabaseUserRepository.collectionName
    );
  }

  public async getUniqueSlug(identifier: string): Promise<string> {
    return Promise.resolve(identifier);
  }

  public async saveNew(user: User): Promise<void> {
    return new Promise((resolve, reject): void => {
      genSalt(SALT_ROUNDS, (error: Error | undefined, salt: string): void => {
        if (error) {
          reject(error);
        } else {
          getHash(
            user.getPassword(),
            salt,
            async (
              hashError: Error | undefined,
              hash: string
            ): Promise<void> => {
              if (!hashError) {
                await this.collection.insertOne({
                  name: user.getName(),
                  email: user.getEmail(),
                  password: hash,
                });
                resolve();
              } else {
                reject(hashError);
              }
            }
          );
        }
      });
    });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable @typescript-eslint/require-await */
  public async deleteExisting(user: User): Promise<void> {
    throw new Error("Not yet implemented");
  }

  public async updateExisting(user: User): Promise<void> {
    throw new Error("Not yet implemented");
  }

  public async getByField<V>(name: string, value: V): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public async getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
