// eslint-disable-next-line import/named
import { Container, interfaces } from "inversify";
import { Logger, TYPES as APP } from "@planv7/application";
import { ResponseAuthHeader, TYPES as FRAMEWORK } from "@planv7/framework";
import { Db } from "mongodb";
import bindDependencies from "./bindDependencies";
import { mock as mockExtended } from "jest-mock-extended";

const testSatisfiesDependency = (
  container: Container,
  service: interfaces.ServiceIdentifier<unknown>
): void => {
  try {
    container.get(service);
  } catch (error) {
    fail(
      `Expected ${String(
        service
      )} to successfully return a service. Error: ${error}`
    );
  }
};

describe("Bind dependencies", () => {
  it("Can retrieve the response auth header", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    // Logger is bound right at the start of the application before
    // anything happens so that logging can take place, so its not the
    // responsibility of bindDependencies
    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);

    testSatisfiesDependency(container, ResponseAuthHeader);
  });

  it("Can retrieve the user repository", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);
    await bindDependencies(container, db);

    testSatisfiesDependency(container, APP.userRepository);
  });

  it("Can retrieve the plan repository", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    testSatisfiesDependency(container, APP.planRepository);
  });

  it("Can retreive the slug generator", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    testSatisfiesDependency(container, APP.slugGenerator);
  });

  it("Can retreive the current login session", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    testSatisfiesDependency(container, APP.currentLoginSession);
  });

  it("Can retreive the jwt public key", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    testSatisfiesDependency(container, FRAMEWORK.jwtPublicKey);
  });

  it("Can retreive the jwt private key", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    testSatisfiesDependency(container, FRAMEWORK.jwtPrivateKey);
  });
});
