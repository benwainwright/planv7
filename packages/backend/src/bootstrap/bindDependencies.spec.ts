import { TYPES as APP, Logger } from "@choirpractise/application";
import { Container, interfaces } from "inversify";
import { TYPES as FRAMEWORK, ResponseAuthHeader } from "@choirpractise/framework";
import { Db } from "mongodb";
import bindDependencies from "./bindDependencies";
import { bindDependencies as bindDependenciesClient } from "@choirpractise/frontend";
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

describe("Bind dependencies on server", () => {
  it("Can retrieve the response auth header", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    // Logger is bound right at the start of the application before
    // anything happens so that logging can take place, so its not the
    // responsibility of bindDependencies
    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db, "foo", "foo");

    testSatisfiesDependency(container, ResponseAuthHeader);
  });

  it("Can retreive the jwt public key", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db, "foo", "foo");
    testSatisfiesDependency(container, FRAMEWORK.jwtPublicKey);
  });

  it("Can retreive the jwt private key", async () => {
    const container = new Container();
    const db = mockExtended<Db>();

    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db, "foo", "foo");
    testSatisfiesDependency(container, FRAMEWORK.jwtPrivateKey);
  });
});

describe("Client and server combined", () => {
  it("Can retreive all dependencies", async (): Promise<void> => {
    const container = new Container();

    const db = mockExtended<Db>();
    const logger = mockExtended<Logger>();
    container.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependencies(container, db, "foo", "foo");
    const appLeftOver: [string, string][] = [];
    Object.keys(APP).forEach((identifierKey) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        container.get((APP as any)[identifierKey]);
      } catch (error) {
        appLeftOver.push([identifierKey, error]);
      }
    });

    const frameworkLeftOver: [string, string][] = [];
    Object.keys(FRAMEWORK).forEach((identifierKey) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        container.get((FRAMEWORK as any)[identifierKey]);
      } catch (error) {
        frameworkLeftOver.push([identifierKey, error]);
      }
    });

    const clientContainer = new Container();
    clientContainer.bind<Logger>(APP.logger).toConstantValue(logger);

    await bindDependenciesClient(clientContainer, "foo");

    const missing: [string, string, string][] = [];
    appLeftOver.forEach((missingItem) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clientContainer.get((APP as any)[missingItem[0]]);
      } catch (error) {
        missing.push([`app/${missingItem[0]}`, error.message, missingItem[1]]);
      }
    });

    frameworkLeftOver.forEach((missingItem) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clientContainer.get((FRAMEWORK as any)[missingItem[0]]);
      } catch (error) {
        missing.push([
          `framework/${missingItem[0]}`,
          error.message,
          missingItem[1],
        ]);
      }
    });

    if (missing.length > 0) {
      fail(
        `${missing.length} services missing:\n\n${missing
          .map(
            (item) =>
              `${item[0]}\nClient Error: ${item[1]}\nServer Error: ${item[2]}`
          )
          .join("\n\n")}`
      );
    }
  });
});
