#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import ApplicationDeploymentStack from "../src/stacks/ApplicationDeploymentStack";

const app = new cdk.App();
new ApplicationDeploymentStack(app, { applicationName: "Planv7" });
