const jestCommon = require("@planv7/jest-common");

const path = require("path");

module.exports = jestCommon.getPackageConfig(path.basename(__dirname));
