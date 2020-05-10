import { TYPES as APP, Logger } from "@planv7/application";
import { Container, interfaces } from "inversify";
import { TYPES as FRAMEWORK, ResponseAuthHeader } from "@planv7/framework";
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

  const testService = async (
    identifiers: {},
    identifierKey: string
  ): Promise<void> => {
    const container = new Container();

    const db = mockExtended<Db>();
    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testSatisfiesDependency(container, (identifiers as any)[identifierKey]);
  };

  Object.keys(FRAMEWORK).forEach((identifierKey) => {
    it(
      `Can retrieve dependency for framework layer identifier: ${String(
        identifierKey
      )}`,
      testService.bind(undefined, FRAMEWORK, identifierKey)
    );
  });

  Object.keys(APP).forEach((identifierKey) => {
    it(
      `Can retrieve dependency for application ayer identifier: ${String(
        identifierKey
      )}`,
      testService.bind(undefined, APP, identifierKey)
    );
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
