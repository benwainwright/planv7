const testing = require("@choirpractise/testing/jest");

module.exports = {
  ...testing.rootConfig,
  projects: [
    ...testing.getProjects("application"),
    ...testing.getProjects("framework"),
    ...testing.getProjects("backend"),
    ...testing.getProjects("frontend"),
    ...testing.getProjects("deployment"),
  ],
};
