import * as cdk from "@aws-cdk/core";
import * as codedeploy from "@aws-cdk/aws-codedeploy";
import * as constants from "../constants";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import * as secretsManager from "@aws-cdk/aws-secretsmanager";
import Casing from "../utils/Casing";

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

    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true
    })

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

    const ip = new ec2.CfnEIP(this, `${props.applicationName}EIp`);

    new ec2.CfnEIPAssociation(this, `${props.applicationName}EipAssociation`, {
      eip: ip.ref,
      instanceId: instance.instanceId,
    });

    const hostedZone = new route53.HostedZone(
      this,
      `${props.applicationName}HostedZone`,
      {
        zoneName: `${props.applicationName.toLowerCase()}.benwainwright.me`,
      }
    );

    new route53.ARecord(this, `${props.applicationName}ARecord`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromIpAddresses(ip.ref),
    });

    const publicKeyConfig = new secretsManager.Secret(
      this,
      `${props.applicationName}JwtPublicKeySecret`,
      {
        secretName: `${props.applicationName}/JWT_PUBLIC_KEY`,
      }
    );
    publicKeyConfig.grantRead(instance);

    const privateKeyConfig = new secretsManager.Secret(
      this,
      `${props.applicationName}JwtPrivateKeySecret`,
      {
        secretName: `${props.applicationName}/JWT_PRIVATE_KEY`,
      }
    );
    privateKeyConfig.grantRead(instance);

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

    const deploymentBucketId = `${props.applicationName}DeploymentBucket`;
    this.codeDeployDeployBucket = Casing.snakeCase(deploymentBucketId);

    const deployBucket = new s3.Bucket(this, deploymentBucketId, {
      bucketName: this.codeDeployDeployBucket,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const filesBucketId = `${props.applicationName}FilesBucket`;
    const filesBucket = new s3.Bucket(this, filesBucketId, {
      bucketName: Casing.snakeCase(filesBucketId),
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    filesBucket.addCorsRule({
      allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"]
    });

    filesBucket.grantReadWrite(instance);
    deployBucket.grantRead(instance);
  }
}
