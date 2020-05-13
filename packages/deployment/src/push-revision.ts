/* eslint-disable no-console */
import * as Filesystem from "./file-system";
import * as execa from "execa";
import * as path from "path";
import infrastructure, { region as appRegion } from "../cdk/infrastructure";
import { promises as fs } from "fs";

const APPSPEC_NAME = "appspec.yml";
const serverPath = path.join(__dirname, "../../../packages/backend/dist");
const frontendPath = path.join(__dirname, "../../../packages/frontend/dist");

const deployPush = async (
  appName: string,
  region: string,
  description: string,
  bucket: string,
  revisionPath: string
): Promise<execa.ExecaReturnValue<string>> => {
  const command = `aws deploy push \
                      --region ${region} \
                      --application-name ${appName} \
                      --description ${description} \
                      --ignore-hidden-files \
                      --s3-location s3://${bucket}/revision.zip \
                      --source ${revisionPath}`;
  return execa.command(command);
};

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

  await deployPush(
    infrastructure.codeDeployAppName,
    appRegion,
    hash,
    infrastructure.codeDeployDeployBucket,
    revisonPath
  );

  console.log(`Done`);

  // eslint-disable-next-line no-console
})().catch((error: Error) => console.log(error));
