const testing = require("@planv7/testing/jest");

module.exports = {
  ...testing.rootConfig,
  projects: [
    ...testing.getProjects("application"),
    ...testing.getProjects("framework"),
    ...testing.getProjects("backend"),
    ...testing.getProjects("frontend"),
  ],
};
