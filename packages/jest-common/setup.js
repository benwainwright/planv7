const inversify = require("inversify");

expect.extend({
  toBeAbleToSatisfyDependency: (container, identifier) => {
    if (!(container instanceof inversify.Container)) {
      throw new Error("Expected container to be an inversify container");
    }
    try {
      container.get(identifier);
    } catch (error) {
      return {
        pass: false,
        message: `Expected ${identifier} to successfully return a service`,
      };
    }
  },
});
