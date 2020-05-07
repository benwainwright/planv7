const path = require("path");

const MONOREPO_ROOT = path.join(__dirname, "../..");

const packageDir = (package) => path.join(MONOREPO_ROOT, "/packages/", package);

const packageFile = (package, file) => path.join(packageDir(package), file);

module.exports = {
  MONOREPO_ROOT,
  packageDir,
  packageFile,
};
