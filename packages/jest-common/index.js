const dom = require("./dom");
const node = require("./node");
const getCommon = require("./common");

const getConfig = (package) => ({
  ...getCommon(package),
  projects: [dom, node],
});

module.exports = getConfig;
