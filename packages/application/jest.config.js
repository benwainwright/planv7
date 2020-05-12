const testing = require("@planv7/testing");

const path = require("path");

module.exports = testing.getPackageConfig(path.basename(__dirname));
