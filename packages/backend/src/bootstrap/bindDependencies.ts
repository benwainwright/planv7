import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  CurrentLoginSession,
  Repository,
  SlugGenerator,
} from "@planv7/application";
import {
  TYPES as FRAMEWORK,
  JwtServerLoginSession,
  MongoDatabasePlanRepository,
  MongoDatabasePlanSlugGenerator,
  MongoDatabaseUserRepository,
  ResponseAuthHeader,
} from "@planv7/framework";
import { Plan, User } from "@planv7/domain";

import { Container } from "inversify";
import { Db } from "mongodb";

const bindDependencies = (container: Container, database: Db): void => {
  container.bind<ResponseAuthHeader>(ResponseAuthHeader).to(ResponseAuthHeader);

  container.bind<Db>(FRAMEWORK.db).toConstantValue(database);

  container
    .bind<Repository<User>>(APP.userRepository)
    .to(MongoDatabaseUserRepository);

  container
    .bind<AuthenticatedEntityRepository<Plan>>(APP.planRepository)
    .to(MongoDatabasePlanRepository);

  container
    .bind<SlugGenerator<Plan>>(APP.slugGenerator)
    .to(MongoDatabasePlanSlugGenerator);

  container
    .bind<CurrentLoginSession>(APP.currentLoginSession)
    .to(JwtServerLoginSession)
    .inRequestScope();
};

export default bindDependencies;
