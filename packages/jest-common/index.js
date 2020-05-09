const getDom = require("./dom");
const getNode = require("./node");
const path = require("path");

const getProjects = (package) => [getDom(package), getNode(package)];

const setupFile = path.join(__dirname, "setup.ts");

const globalSettings = {
  setupFilesAfterEnv: [setupFile],
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
