import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";

interface CognitioUserPoolProps {
  applicationName: string;
  callbackUrl: string;
}

export default class CognitoUserPool extends cdk.Construct {
  public constructor(context: cdk.Construct, props: CognitioUserPoolProps) {
    super(context, `${props.applicationName}UserPool`);

    const userPool = new cognito.UserPool(this, `${props.applicationName}Users`, {
      userPoolName: `${props.applicationName}Users`,
      autoVerify: { email: true, phone: false },
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
      },
      standardAttributes: {
        email: { required: true, mutable: false },
        fullname: { required: true, mutable: true },
      },
    });

    new cognito.UserPoolClient(this, `${props.applicationName}UsersWebClient`, {
      userPoolClientName: `${props.applicationName}UsersWebClient`,
      userPool,
      authFlows: {
        userPassword: true
      },
      oAuth: {
        callbackUrls: [props.callbackUrl],
        flows: {
          authorizationCodeGrant: true
        }
      },
      preventUserExistenceErrors: false
    })
  }
}
