const getCommon = require("./getCommon");

const getDom = (package) => ({
  ...getCommon(package),
  displayName: `${package}-dom`,
  testEnvironment: "jsdom",
  testMatch: ["**/*.spec.dom.(tsx|ts)"],
});

module.exports = getDom;
