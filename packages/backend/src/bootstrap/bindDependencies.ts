import { TYPES as FRAMEWORK, ResponseAuthHeader } from "@planv7/framework";
import { Container } from "inversify";
import { Db } from "mongodb";

const bindDependencies = (container: Container, database: Db): void => {
  container.bind<ResponseAuthHeader>(ResponseAuthHeader).to(ResponseAuthHeader);
  container.bind<Db>(FRAMEWORK.db).toConstantValue(database);
};

export default bindDependencies;
