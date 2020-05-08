const getDom = require("./dom");
const getNode = require("./node");

const getProjects = (package) => [getDom(package), getNode(package)];

const coverageExclusions = ["!**/*.spec.{ts, tsx}", "!**/*.spec.dom.{ts, tsx}"];

const collectCoverageFromPackage = (package) => [
  `packages/${package}/**/*.{ts,tsx}`,
  ...coverageExclusions,
];

const getPackageConfig = (package) => ({
  collectCoverage: true,
  collectCoverageFrom: collectCoverageFromPackage(package),
  projects: [getDom(package), getNode(package)],
});

const rootConfig = {
  collectCoverage: true,
  collectCoverageFrom: collectCoverageFromPackage("**"),
};

module.exports = {
  rootConfig,
  getProjects,
  getPackageConfig,
};
