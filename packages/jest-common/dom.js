const getCommon = require("./common");

const getDom = (package) => ({
  ...getCommon,
  displayName: "dom",
  testEnvironment: "jsdom",
  testMatch: ["**/*.spec.dom.(tsx|ts)"],
});

module.exports = getDom;
