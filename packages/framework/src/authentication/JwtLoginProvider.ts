import {
  TYPES as APP,
  ApplicationError,
  Logger,
  LoginProvider,
} from "@planv7/application";

import { Collection, Db } from "mongodb";
import { inject, injectable, optional } from "inversify";

import MongoDbUserRepository from "../storage/MongoDbUserRepository";
import ResponseAuthHeader from "../ResponseAuthHeader";
import TYPES from "../TYPES";
import { User } from "@planv7/domain";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

@injectable()
export default class JwtLoginProvider implements LoginProvider {
  private readonly collection: Collection;
  private readonly authHeader: ResponseAuthHeader | undefined;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly logger: Logger;

  public constructor(
    @inject(TYPES.db) database: Db,
    @inject(TYPES.jwtPublicKey)
    publicKey: string,
    @inject(TYPES.jwtPrivateKey)
    privateKey: string,
    @inject(APP.logger)
    logger: Logger,
    @optional()
    @inject(TYPES.responseAuthHeader)
    authHeader?: ResponseAuthHeader
  ) {
    this.collection = database.collection(MongoDbUserRepository.collectionName);
    this.authHeader = authHeader;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.logger = logger;
    this.logger.debug(`JWT Public key: ${this.publicKey}`);
  }

  public async login(username: string, password: string): Promise<User> {
    const user = await this.doLogin(username, password);
    if (this.authHeader) {
      const token = await this.signUser(user);
      this.authHeader.setHeader(token);
    }
    return user;
  }

  private async signUser(user: User): Promise<string> {
    return new Promise<string>((accept, reject): void => {
      sign(
        { ...user },
        this.privateKey,
        { algorithm: "RS256" },
        (error: Error | null, token: string | undefined): void => {
          if (error) {
            reject(error);
          } else {
            accept(token);
          }
        }
      );
    });
  }

  private async doLogin(username: string, password: string): Promise<User> {
    const query = { name: username };
    const data = await this.collection.findOne(query);
    return new Promise((accept, reject): void => {
      if (data) {
        compare(
          password,
          data.password,
          (error: Error, success: boolean): void => {
            if (success) {
              const user = new User(data.name, data.email, "");
              accept(user);
            } else {
              reject(new ApplicationError("Login Failed"));
            }
          }
        );
      } else {
        reject(new ApplicationError("Login Failed"));
      }
    });
  }
}
