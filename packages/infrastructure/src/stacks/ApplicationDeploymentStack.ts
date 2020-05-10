import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

interface ApplicationDeploymentStackProps {
  applicationName: string;
}

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

    new ec2.Instance(this, `${props.applicationName}Instance`, {
      instanceType,
      machineImage,
      vpc,
      instanceName: `${props.applicationName}Instance`,
    });
  }
}
