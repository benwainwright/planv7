import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as path from "path";

interface ApplicationDeploymentStackProps {
  applicationName: string;
  codeDeployBucket: string;
}

const TAG_KEY = "Name";
const TAG_VALUE = "Planv7";

export default class ApplicationDeploymentStack extends cdk.Stack {
  public constructor(
    context: cdk.Construct,
    props: ApplicationDeploymentStackProps
  ) {
    super(context, `${props.applicationName}DeploymentStack`);

    const vpc = new ec2.Vpc(this, `${props.applicationName}Vpc`);
    const machineImage = ec2.MachineImage.latestAmazonLinux();

    const instanceType = ec2.InstanceType.of(
      ec2.InstanceClass.T3,
      ec2.InstanceSize.MICRO
    );

    const userData = `#!/bin/bash
yum -y update
yum install -y ruby
cd /home/ec2-user
curl -O https://${props.codeDeployBucket}.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto`;

    const instance = new ec2.Instance(
      this,
      `${props.applicationName}Instance`,
      {
        instanceType,
        machineImage,
        vpc,
        userData: ec2.UserData.custom(userData),
        instanceName: `${props.applicationName}Instance`,
      }
    );

    instance.connections.allowDefaultPortFromAnyIpv4();

    cdk.Tag.add(instance, TAG_KEY, TAG_VALUE);
  }
}
