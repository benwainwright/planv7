import * as Domain from "@planv7/domain";

import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  Logger,
  LoginProvider,
  Repository,
  Serialiser,
  SlugGenerator,
} from "@planv7/application";

import {
  TYPES as FRAMEWORK,
  JwtLoginProvider,
  JwtServerLoginSession,
  MongoDatabasePlanRepository,
  MongoDatabasePlanSlugGenerator,
  MongoDatabaseUserRepository,
  ResponseAuthHeader,
  TEST_PRIVATE_KEY,
  TEST_PUBLIC_KEY,
} from "@planv7/framework";

import { Container } from "inversify";
import { Db } from "mongodb";
import getKey from "./getKey";

const bindDependencies = async (
  container: Container,
  database: Db
): Promise<void> => {
  const logger = container.get<Logger>(APP.logger);

  const jwtPublicKey = await getKey("JWT_PUBLIC_KEY", TEST_PUBLIC_KEY, logger);

  const jwtPrivateKey = await getKey(
    "JWT_PRIVATE_KEY",
    TEST_PRIVATE_KEY,
    logger
  );

  container.bind<string>(FRAMEWORK.jwtPublicKey).toConstantValue(jwtPublicKey);

  container
    .bind<string>(FRAMEWORK.jwtPrivateKey)
    .toConstantValue(jwtPrivateKey);
  container.bind<ResponseAuthHeader>(ResponseAuthHeader).to(ResponseAuthHeader);

  container.bind<Db>(FRAMEWORK.db).toConstantValue(database);

  container
    .bind<Repository<Domain.User>>(APP.userRepository)
    .to(MongoDatabaseUserRepository);

  container
    .bind<AuthenticatedEntityRepository<Domain.Plan>>(APP.planRepository)
    .to(MongoDatabasePlanRepository);

  container
    .bind<SlugGenerator<Domain.Plan>>(APP.slugGenerator)
    .to(MongoDatabasePlanSlugGenerator);

  container
    .bind<CurrentLoginSession>(APP.currentLoginSession)
    .to(JwtServerLoginSession)
    .inRequestScope();

  container
    .bind<Serialiser>(APP.serialiser)
    .toConstantValue(new Serialiser(Domain));

  container.bind<LoginProvider>(APP.loginProvider).to(JwtLoginProvider);
};

export default bindDependencies;
