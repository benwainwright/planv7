#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import ApplicationDeploymentStack from "../src/stacks/ApplicationDeploymentStack";
import CIUserStack from "../src/stacks/CIUserStack";

const EU_WEST_2_LONDON_CODE_DEPLOY_RESOURCES_BUCKET =
  "aws-codedeploy-eu-west-2";

const app = new cdk.App();

export const region = "us-east-1";
const applicationName = "choirpractise";
const account = "661272765443";

const infrastructure = new ApplicationDeploymentStack(app, {
  applicationName,
  codeDeployBucket: EU_WEST_2_LONDON_CODE_DEPLOY_RESOURCES_BUCKET,
  keyName: applicationName,
  env: {
    region,
    account,
  },
});

new CIUserStack(app, {
  applicationName,
  env: { region, account },
  userName: `${applicationName}-ci-machine-user`,
});

export default infrastructure;
