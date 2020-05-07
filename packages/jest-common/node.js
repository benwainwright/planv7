const getCommon = require("./common");

const getNode = (package) => ({
  ...getCommon(package),
  displayName: `${package}-node`,
  testEnvironment: "node",
  testMatch: ["**/*.spec.(tsx|ts)"],
});

module.exports = getNode;
