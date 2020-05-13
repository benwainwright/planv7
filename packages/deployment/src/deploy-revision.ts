/* eslint-disable no-console */
import * as Aws from "./aws";
import * as Filesystem from "./file-system";
import * as execa from "execa";
import * as path from "path";
import infrastructure, { region as appRegion } from "../cdk/infrastructure";

import { promises as fs } from "fs";

const APPSPEC_NAME = "appspec.yml";
const serverPath = path.join(__dirname, "../../../packages/backend/dist");
const frontendPath = path.join(__dirname, "../../../packages/frontend/dist");

(async (): Promise<void> => {
  const revisonPath = path.join(__dirname, "../revision");
  await Filesystem.forceDelete(revisonPath);
  await fs.mkdir(revisonPath);

  await Filesystem.copyToDirectory(serverPath, revisonPath);
  await Filesystem.copyToDirectory(frontendPath, revisonPath);

  await fs.copyFile(
    path.join(__dirname, APPSPEC_NAME),
    path.join(revisonPath, APPSPEC_NAME)
  );

  const { stdout: hash } = await execa.command("git rev-parse HEAD");
  console.log(`Pushing revision ${hash}`);

  const { stdout } = await Aws.deployPush(
    infrastructure.codeDeployAppName,
    appRegion,
    hash,
    infrastructure.codeDeployDeployBucket,
    revisonPath
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
  // eslint-disable-next-line no-console
})().catch((error: Error) => console.log(error));
