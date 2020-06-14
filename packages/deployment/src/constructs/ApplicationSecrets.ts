import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as secretsManager from "@aws-cdk/aws-secretsmanager";

interface ApplicationSecretProps {
  applicationName: string;
  secrets: string[];
  grantables: iam.IGrantable[];
}

export default class ApplicationSecrets extends cdk.Construct {
  public constructor(context: cdk.Construct, props: ApplicationSecretProps) {
    super(context, `${props.applicationName}Secrets`);
    props.secrets.forEach((secretName: string) => {
      const secret = new secretsManager.Secret(
        this,
        `${props.applicationName}${secretName}Secret`,
        {
          secretName: `${props.applicationName}/${secretName}`,
        }
      );

      props.grantables.forEach((grantable: iam.IGrantable) =>
        secret.grantRead(grantable)
      );
    });
  }
}
