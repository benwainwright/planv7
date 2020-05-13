/* eslint-disable no-console */
import * as execa from "execa";

const POLL_TIME = 1000;

export const deployPush = async (
  appName: string,
  region: string,
  description: string,
  bucket: string,
  revisionPath: string
): Promise<execa.ExecaReturnValue<string>> => {
  const command = `aws deploy push \
                      --output json \
                      --region ${region} \
                      --application-name ${appName} \
                      --description ${description} \
                      --ignore-hidden-files \
                      --s3-location s3://${bucket}/revision.zip \
                      --source ${revisionPath}`;
  return execa.command(command);
};

const getDeployStatus = async (
  deploymentId: string,
  region: string
): Promise<execa.ExecaReturnValue<string>> => {
  const command = `aws deploy get-deployment \
                       --region ${region} \
                       --deployment-id ${deploymentId}`;
  return execa.command(command);
};

const pollForCompleteDeployment = async (
  deploymentId: string,
  region: string
): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const { stdout: response } = await getDeployStatus(deploymentId, region);
      const status = JSON.parse(response);
      if (status.deploymentInfo.status === "Succeeded") {
        clearInterval(interval);
        resolve();
      } else {
        console.log(`Status: ${status.deploymentInfo.status}`);
      }
    }, POLL_TIME);
  });
};

export const deploy = async (
  appName: string,
  region: string,
  groupName: string,
  s3Location: string
): Promise<void> => {
  const command = `aws deploy create-deployment \
                      --application-name ${appName} \
                      --region ${region} \
                      --deployment-group-name ${groupName} \
                      --s3-location ${s3Location}`;
  const { stdout } = await execa.command(command);
  const response = JSON.parse(stdout);
  return pollForCompleteDeployment(response.deploymentId, region);
};
