import { ResponseAuthHeader } from "@planv5/framework";
import { FRAMEWORK_TYPES } from "../../types";
import { User } from "@planv5/domain";
import { APP_TYPES , Logger, LoginProvider } from "@planv5/application/ports";
import { compare } from "bcryptjs";
import { inject, injectable, optional } from "inversify";
import { Collection, Db } from "mongodb";
import { USERS_COLLECTION_NAME } from "../storage/MongoDbUserRepository";
import { ApplicationError } from "@planv5/application/errors";
import { sign } from "jsonwebtoken";


@injectable()
export class JwtLoginProvider implements LoginProvider {
  private readonly collection: Collection;
  private readonly authHeader: ResponseAuthHeader | undefined;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly logger: Logger;

  public constructor(
    @inject(FRAMEWORK_TYPES.Db) database: Db,
    @inject(FRAMEWORK_TYPES.JwtPublicKey)
    publicKey: string,
    @inject(FRAMEWORK_TYPES.JwtPrivateKey)
    privateKey: string,
    @inject(APP_TYPES.Logger)
    logger: Logger,
    @optional()
    @inject(FRAMEWORK_TYPES.ResponseAuthHeader)
    authHeader?: ResponseAuthHeader
  ) {
    this.collection = database.collection(USERS_COLLECTION_NAME);
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
    return new Promise<string>(
      async (accept, reject): Promise<void> => {
        sign(
          { ...user},
          this.privateKey,
          { algorithm: "RS256" },
          (error: Error, token: string): void => {
            if (error) {
              reject(error);
            } else {
              accept(token);
            }
          }
        );
      }
    );
  }

  private async doLogin(username: string, password: string): Promise<User> {
    return new Promise(
      async (accept, reject): Promise<void> => {
        const query = { name: username };
        const data = await this.collection.findOne(query);
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
      }
    );
  }
}
