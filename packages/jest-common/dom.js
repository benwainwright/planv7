const getCommon = require("./common");

const getDom = (package) => ({
  ...getCommon(package),
  displayName: "dom",
  testEnvironment: "jsdom",
  testMatch: ["**/*.spec.dom.(tsx|ts)"],
});

module.exports = getDom;
