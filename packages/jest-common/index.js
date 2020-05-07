const getDom = require("./dom");
const getNode = require("./node");

const getConfig = (package) => ({
  collectCoverage: true,
  collectCoverageFrom: [`packages/${package}/src/**/*.ts`],
  projects: [getDom(package), getNode(package)],
});

module.exports = getConfig;
