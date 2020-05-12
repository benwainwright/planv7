const testing = require("@planv7/testing/jest");

const path = require("path");

module.exports = testing.getPackageConfig(path.basename(__dirname));
