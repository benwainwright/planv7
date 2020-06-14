import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

interface CIUserStackProps {
  applicationName: string;
  userName: string;
}

export default class CIUserStack extends cdk.Stack {
  public constructor(
    context: cdk.Construct,
    props: CIUserStackProps & cdk.StackProps
  ) {
    super(context, `${props.applicationName}CIUserStack`, props);

    const ciUser = new iam.User(this, `${props.applicationName}CIUser`, {
      userName: props.userName,
    });

    const ciUserPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });

    ciUserPolicyStatement.addActions(
      "cloudformation:*",
      "iam:*",
      "ssm:*",
      "ec2:*",
      "s3:*",
      "codedeploy:*",
      "secretsmanager:*",
      "route53:*",
      "cloudfront:*",
      "cognito:*",
      "cognito-idp:*"
    );
    ciUserPolicyStatement.addResources("*");

    ciUser.addToPolicy(ciUserPolicyStatement);
  }
}
