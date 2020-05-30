const testing = require("@choirpractise/testing/jest");

const path = require("path");

module.exports = testing.getPackageConfig(path.basename(__dirname));
