#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import ApplicationDeploymentStack from "../src/stacks/ApplicationDeploymentStack";

const EU_WEST_2_LONDON_CODE_DEPLOY_RESOURCES_BUCKET =
  "aws-codedeploy-eu-west-2";

const app = new cdk.App();

export const region = "us-east-1";

const infrastructure = new ApplicationDeploymentStack(app, {
  applicationName: "Planv7",
  codeDeployBucket: EU_WEST_2_LONDON_CODE_DEPLOY_RESOURCES_BUCKET,
  keyName: "Planv7",
  env: {
    region,
    account: "661272765443",
  },
});

export default infrastructure;
