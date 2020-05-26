import * as Domain from "@planv7/domain";

import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  EventEmitterWrapper,
  LoginProvider,
  Repository,
  Serialiser,
  SlugGenerator,
  SimpleCommandBus,
} from "@planv7/application";

import {
  TYPES as FRAMEWORK,
  JwtLoginProvider,
  JwtServerLoginSession,
  MongoDatabasePlanRepository,
  MongoDatabasePlanSlugGenerator,
  MongoDatabaseUserRepository,
  ResponseAuthHeader,
} from "@planv7/framework";

import { Container } from "inversify";
import { Db } from "mongodb";

const bindDependencies = (
  container: Container,
  database: Db,
  jwtPublicKey: string,
  jwtPrivateKey: string
): void => {
  container
    .bind<EventEmitterWrapper>(APP.eventEmitterWrapper)
    .to(EventEmitterWrapper);

  container
    .bind<Domain.CommandBus>(Domain.TYPES.commandBus)
    .to(SimpleCommandBus);

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
