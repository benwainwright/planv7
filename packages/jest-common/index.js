const getDom = require("./dom");
const getNode = require("./node");

const getProjects = (package) => [getDom(package), getNode(package)];

const getPackageConfig = (package) => ({
  collectCoverage: true,
  collectCoverageFrom: [`packages/${package}/src/**/*.ts`],
  projects: [getDom(package), getNode(package)],
});

module.exports = {
  getProjects,
  getPackageConfig,
};
