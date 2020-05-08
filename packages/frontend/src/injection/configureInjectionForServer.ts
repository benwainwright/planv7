import "reflect-metadata";

import { JwtLoginProvider, JwtServerLoginSession ,
  MongoDbPlanRepository,
  MongoDbPlanSlugGenerator,
  MongoDbUserRepository,
  ResponseAuthHeader,
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY
} from "@planv5/framework";
import { FRAMEWORK_TYPES } from "@planv5/framework/types";
import { Container, decorate, injectable } from "inversify";

import { ApplicationError } from "@planv5/application/errors";
import { DomainError, Serialiser } from "@planv5/domain";
import * as commands from "@planv5/domain/commands";
import * as events from "@planv5/domain/events";
import * as entities from "@planv5/domain/entities";

import { Db, MongoClient } from "mongodb";
import {
  EventEmitterWrapper,
  SimpleCommandBus,
  container as initialContainer
} from "@planv5/application";
import { Plan, User } from "@planv5/domain/entities";
import { getKey } from "./getKey";
import {
  APP_TYPES,
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  Logger,
  LoginProvider,
  Repository,
  SlugGenerator
} from "@planv5/application/ports";

import { MONGO_DB_NAME } from "../constants";

decorate(injectable(), Db);

export const initInjection = async (
  container?: Container,
  client?: MongoClient
): Promise<Container> => {
  container = container || initialContainer;

  const logger = container.get<Logger>(APP_TYPES.Logger);
  logger.info("Connecting to database...");
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

  client =
    client ||
    await MongoClient.connect(mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

  logger.info("Binding application services...");

  container.bind<ResponseAuthHeader>(ResponseAuthHeader).to(ResponseAuthHeader);
  const database = client.db(process.env.MONGO_DB_NAME || MONGO_DB_NAME);
  container.bind<Db>(FRAMEWORK_TYPES.Db).toConstantValue(database);
  container
    .bind<Repository<User>>(APP_TYPES.UserRepository)
    .to(MongoDbUserRepository);

  container
    .bind<AuthenticatedEntityRepository<Plan>>(APP_TYPES.PlanRepository)
    .to(MongoDbPlanRepository);

  container
    .bind<SlugGenerator<Plan>>(APP_TYPES.SlugGenerator)
    .to(MongoDbPlanSlugGenerator);

  container
    .bind<CurrentLoginSession>(APP_TYPES.CurrentLoginSession)
    .to(JwtServerLoginSession)
    .inRequestScope();

  let jwtPublicKey = process.env.JWT_PUBLIC_KEY;
  if (!jwtPublicKey && process.env.NODE_ENV === "production") {
    throw new Error(`Must specify JWT_PUBLIC_KEY on production build`);
  } else {
    jwtPublicKey = TEST_PUBLIC_KEY;
  }

  let jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
  if (!jwtPrivateKey && process.env.NODE_ENV === "production") {
    throw new Error(`Must specify JWT_PRIVATE_KEY on production build`);
  } else {
    jwtPrivateKey = TEST_PRIVATE_KEY;
  }

  const serialiseableConstructors = {
    ...entities,
    ...commands,
    ...events,
    DomainError,
    ApplicationError
  };

  container
    .bind<Serialiser>(Serialiser)
    .toConstantValue(new Serialiser(serialiseableConstructors));

  container
    .bind<string>(FRAMEWORK_TYPES.JwtPublicKey)
    .toConstantValue(jwtPublicKey);
  container
    .bind<string>(FRAMEWORK_TYPES.JwtPrivateKey)
    .toConstantValue(jwtPrivateKey);

  container.bind<LoginProvider>(APP_TYPES.LoginProvider).to(JwtLoginProvider);

  logger.info("Inversify container initialised...");

  return container;
};
