import { Container, interfaces } from "inversify";
import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAbleToSatisfyDependency: (
        container: Container,
        identifier: interfaces.ServiceIdentifier<unknown>
      ) => object;
    }

    interface Expect {
      toBeAbleToSatisfyDependency: (
        container: Container,
        identifier: interfaces.ServiceIdentifier<unknown>
      ) => object;
    }
  }
}

expect.extend({
  toBeAbleToSatisfyDependency: (
    container: Container,
    identifier: interfaces.ServiceIdentifier<unknown>
  ): jest.CustomMatcherResult => {
    if (!(container instanceof Container)) {
      throw new Error("Expected container to be an inversify container");
    }
    try {
      container.get(identifier);
    } catch (error) {
      return {
        pass: false,
        message: () =>
          `Expected ${String(identifier)} to successfully return a service`,
      };
    }
  },
});
