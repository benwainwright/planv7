const path = require("path");

const MONOREPO_ROOT = path.join(__dirname, "../..");

const esModules = ["typeson-registry"].join("|");

const getCommon = (package) => ({
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  rootDir: MONOREPO_ROOT,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  roots: [`<rootDir>/packages/${path.basename(package)}`],
  globals: {
    "ts-jest": {
      tsConfig: path.join(
        MONOREPO_ROOT,
        `packages/${package}`,
        "tsconfig.json"
      ),
    },
  },
});

module.exports = getCommon;
