import * as Domain from "@choirpractise/domain";

import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  EventEmitterWrapper,
  LoginProvider,
  Repository,
  Serialiser,
  SimpleCommandBus,
  SlugGenerator,
} from "@choirpractise/application";

import {
  TYPES as FRAMEWORK,
  JwtLoginProvider,
  JwtServerLoginSession,
  MongoDatabasePlanRepository,
  MongoDatabasePlanSlugGenerator,
  MongoDatabaseUserRepository,
  ResponseAuthHeader,
} from "@choirpractise/framework";

import { Container } from "inversify";
import { Db } from "mongodb";

const bindDependencies = (
  container: Container,
  database: Db,
  jwtPublicKey: string,
  jwtPrivateKey: string
): void => {
  container
    .bind<EventEmitterWrapper>(EventEmitterWrapper)
    .to(EventEmitterWrapper)
    .inRequestScope();

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
    .bind<Serialiser>(Serialiser)
    .toConstantValue(new Serialiser(Domain));

  container.bind<LoginProvider>(APP.loginProvider).to(JwtLoginProvider);
};

export default bindDependencies;
