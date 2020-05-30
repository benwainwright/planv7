/* eslint-disable no-console */
import * as Aws from "./aws";
import * as execa from "execa";
import * as path from "path";
import infrastructure, { region as appRegion } from "../cdk/infrastructure";
import buildRpm from "./buildRpm";

const PACKAGES_DIR = path.join(__dirname, "..", "..", "..", "packages");
const SERVER_PATH = path.join(
  PACKAGES_DIR,
  "backend",
  "dist",
  "choirpractise-server.js"
);
const SOURCE_MAP_PATH = path.join(
  PACKAGES_DIR,
  "backend",
  "dist",
  "choirpractise-server.js.map"
);
const FRONTEND_PATH = path.join(PACKAGES_DIR, "frontend", "dist", "assets");
const REVISION_DIR = path.join(__dirname, "..", "revision");
const PLANV7_DOT_SERVICE = path.join(
  __dirname,
  "..",
  "etc",
  "systemd",
  "system",
  "choirpractise.service"
);

(async (): Promise<void> => {
  console.log("Packaging application");
  await buildRpm(
    "choirpractise",
    ["mongodb-org", "nodejs", "nginx", "jq"],
    {
      [SERVER_PATH]: "/usr/bin/choirpractise-server",
      [SOURCE_MAP_PATH]: "/usr/bin/choirpractise-server.map",
      [FRONTEND_PATH]: "/srv/choirpractise",
      [PLANV7_DOT_SERVICE]: "/etc/systemd/system/choirpractise.service",
    },
    REVISION_DIR
  );

  const { stdout: hash } = await execa.command("git rev-parse HEAD");
  console.log(`Pushing revision ${hash} to S3`);

  const { stdout } = await Aws.deployPush(
    infrastructure.codeDeployAppName,
    appRegion,
    hash,
    infrastructure.codeDeployDeployBucket,
    REVISION_DIR
  );

  const bucketRegex = /--s3-location (?<bucket>[\w=\-,.]*)/u;
  const bucket = bucketRegex.exec(stdout)?.groups?.bucket;
  if (bucket) {
    console.log("Creating deployment");
    await Aws.deploy(
      infrastructure.codeDeployAppName,
      appRegion,
      infrastructure.codeDeployDeployGroupName,
      bucket
    );
    console.log("Deploy was successful");
  } else {
    throw new Error("Bucket not found in push output");
  }
})().catch((error: Error) => {
  // eslint-disable-next-line no-console
  console.log(`Error: ${error.message}`);
  process.exitCode = 1;
});
