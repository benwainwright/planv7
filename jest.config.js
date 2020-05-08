const jestCommon = require("@planv7/jest-common");

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    `packages/**/src/**/*.{ts,tsx}`,
    "!**/*.spec.{ts,tsx}",
    "!**/*.spec.dom.{ts,tsx}",
  ],
  projects: [
    ...jestCommon.getProjects("application"),
    ...jestCommon.getProjects("framework"),
  ],
};
