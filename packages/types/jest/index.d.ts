import { Container, interfaces } from "inversify";

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
