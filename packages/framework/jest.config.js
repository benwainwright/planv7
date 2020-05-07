const path = require("path");

const PACKAGE_PATH = __dirname;

const MONOREPO_ROOT = path.join(PACKAGE_PATH, "../..");

esModules = ["typeson-registry"].join("|");

module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  rootDir: MONOREPO_ROOT,
  roots: [`<rootDir>/packages/${path.basename(PACKAGE_PATH)}`],
  globals: {
    "ts-jest": {
      tsConfig: path.join(PACKAGE_PATH, "tsconfig.json"),
    },
  },
};
