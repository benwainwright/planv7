import * as cdk from "@aws-cdk/core";
import * as codedeploy from "@aws-cdk/aws-codedeploy";
import * as constants from "../constants";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";

interface ApplicationDeploymentStackProps {
  applicationName: string;
  keyName: string;
  codeDeployBucket: string;
}

export default class ApplicationDeploymentStack extends cdk.Stack {
  public readonly codeDeployAppName: string;
  public readonly codeDeployDeployBucket: string;
  public readonly codeDeployDeployGroupName: string;
  public constructor(
    context: cdk.Construct,
    props: ApplicationDeploymentStackProps & cdk.StackProps
  ) {
    super(context, `${props.applicationName}DeploymentStack`, props);

    const vpc = new ec2.Vpc(this, `${props.applicationName}Vpc`);

    const machineImage = ec2.MachineImage.latestAmazonLinux({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    });

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
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        userData: ec2.UserData.custom(userData),
        instanceName: `${props.applicationName}Instance`,
        keyName: props.keyName,
      }
    );

    instance.connections.allowFromAnyIpv4(
      ec2.Port.tcp(constants.DefaultPorts.Ssh)
    );
    instance.connections.allowFromAnyIpv4(
      ec2.Port.tcp(constants.DefaultPorts.Http)
    );
    instance.connections.allowFromAnyIpv4(
      ec2.Port.tcp(constants.DefaultPorts.Https)
    );

    const codeBuildDeployPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      sid: `${props.applicationName}CodeBuildDeployPolicy`,
    });

    codeBuildDeployPolicy.addActions("s3:Get*", "s3:List*");
    codeBuildDeployPolicy.addResources(
      `arn:aws:s3:::${props.codeDeployBucket}/*`
    );

    instance.addToRolePolicy(codeBuildDeployPolicy);

    const tagKeyName = "Name";
    const tagKeyValue = props.applicationName;

    const ec2InstanceTags = new codedeploy.InstanceTagSet({
      [tagKeyName]: [tagKeyValue],
    });
    cdk.Tag.add(instance, tagKeyName, tagKeyValue);

    this.codeDeployAppName = `${props.applicationName}CodeDeployApplication`;

    const application = new codedeploy.ServerApplication(
      this,
      this.codeDeployAppName,
      {
        applicationName: this.codeDeployAppName,
      }
    );

    this.codeDeployDeployGroupName = `${props.applicationName}DeploymentGroup`;

    new codedeploy.ServerDeploymentGroup(this, this.codeDeployDeployGroupName, {
      application,
      ec2InstanceTags,
      deploymentGroupName: this.codeDeployDeployGroupName,
    });

    const bucketId = `${props.applicationName}DeploymentBucket`;

    this.codeDeployDeployBucket = bucketId
      .split(/(?=[A-Z])/u)
      .join("-")
      .toLowerCase();

    const deployBucket = new s3.Bucket(this, bucketId, {
      bucketName: this.codeDeployDeployBucket,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    deployBucket.grantRead(instance);
  }
}
