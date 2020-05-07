const getConfig = require("@planv7/jest-common");

const path = require("path");

module.exports = getConfig(path.basename(__dirname));
