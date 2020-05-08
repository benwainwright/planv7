const getDom = require("./dom");
const getNode = require("./node");

const getProjects = (package) => [getDom(package), getNode(package)];

const globalSettings = {
  reporters: ["default", ["jest-junit", { outputName: "junit.xml" }]],
  collectCoverage: true,
};

const coverageExclusions = ["!**/*.spec.{ts, tsx}", "!**/*.spec.dom.{ts, tsx}"];

const collectCoverageFromPackage = (package) => [
  `packages/${package}/**/*.{ts,tsx}`,
  ...coverageExclusions,
];

const getPackageConfig = (package) => ({
  ...globalSettings,
  collectCoverageFrom: collectCoverageFromPackage(package),
  projects: [getDom(package), getNode(package)],
});

const rootConfig = {
  ...globalSettings,
  collectCoverageFrom: collectCoverageFromPackage("**"),
};

module.exports = {
  rootConfig,
  getProjects,
  getPackageConfig,
};
