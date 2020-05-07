const getDom = require("./dom");
const getNode = require("./node");

const getConfig = (package) => ({
  projects: [getDom(package), getNode(package)],
});

module.exports = getConfig;
