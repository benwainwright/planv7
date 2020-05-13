import * as execa from "execa";

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

export const deployCreate = async (
  appName: string,
  groupName: string,
  s3Location: string
): Promise<execa.ExecaReturnValue<string>> => {
  const command = `aws deploy create-deployment \
                      --application-name ${appName} \
                      --deployment-group-name ${groupName} \
                      --s3-location ${s3Location}`;
  return execa.command(command);
};
