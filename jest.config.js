const jestCommon = require("@planv7/jest-common");

module.exports = {
  ...jestCommon.rootConfig,
  projects: [
    ...jestCommon.getProjects("application"),
    ...jestCommon.getProjects("framework"),
  ],
};
