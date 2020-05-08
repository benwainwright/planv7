const jestCommon = require("@planv7/jest-common");

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [`packages/**/src/**/*.ts`],
  projects: [
    ...jestCommon.getProjects("application"),
    ...jestCommon.getProjects("framework"),
  ],
};
