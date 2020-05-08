const paths = require("./paths");

const esModules = ["typeson-registry"].join("|");

const getCommon = (package) => ({
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  rootDir: paths.MONOREPO_ROOT,
  roots: [paths.packageDir(package)],
  globals: {
    "ts-jest": {
      tsConfig: paths.packageFile(package, "tsconfig.json"),
    },
  },
});

module.exports = getCommon;
