/* eslint-disable no-console */
import * as Aws from "./aws";
import * as execa from "execa";
import * as path from "path";
import infrastructure, { region as appRegion } from "../cdk/infrastructure";
import buildRpm from "./buildRpm";

const PACKAGES_DIR = path.join(__dirname, "..", "..", "..", "packages");
const SERVER_PATH = path.join(PACKAGES_DIR, "backend", "dist", "planv7-server");
const FRONTEND_PATH = path.join(PACKAGES_DIR, "frontend", "dist", "assets");
const REVISION_DIR = path.join(__dirname, "..", "revision");
const RPM_PATH = path.join(REVISION_DIR, "planv7.rpm");

(async (): Promise<void> => {
  console.log("Packaging application");
  await buildRpm(
    "planv7",
    ["mongodb-org", "epel-release", "nodejs", "nginx"],
    {
      [SERVER_PATH]: "/usr/bin",
      [FRONTEND_PATH]: "/srv/planv7",
    },
    RPM_PATH
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
