const getCommon = require("./getCommon");

const getNode = (package) => ({
  ...getCommon(package),
  displayName: `${package}-node`,
  testEnvironment: "node",
  testMatch: ["**/*.spec.(tsx|ts)"],
});

module.exports = getNode;
