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

    const cloudFormationDeployStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    cloudFormationDeployStatement.addActions(
      "cloudformation:CreateChangeSet",
      "cloudformation:CreateStack",
      "cloudformation:UpdateStack",
      "cloudformation:DeleteStack",
      "cloudformation:GetTemplate",
      "cloudformation:DescribeStacks"
    );
    cloudFormationDeployStatement.addResources("*");

    ciUser.addToPolicy(cloudFormationDeployStatement);

    const manageIamPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    manageIamPolicyStatement.addActions(
      "iam:CreateRole",
      "iam:UpdateRole",
      "iam:DeleteRole",
      "iam:CreateUser",
      "iam:UpdateUser",
      "iam:DeleteUser",
      "iam:CreatePolicy",
      "iam:UpdatePolicy",
      "iam:DeletePolicy"
    );
    manageIamPolicyStatement.addResources("*");
    ciUser.addToPolicy(manageIamPolicyStatement);
  }
}
