module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transformIgnorePatterns: ["node_modules/(?!(typeson-registry)/)"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
};
