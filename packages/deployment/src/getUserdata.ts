export enum RunTime {
  EveryBoot,
  FirstBoot,
}

const getUserdata = (
  when: RunTime,
  logFile: string,
  yumDependencies: string[],
  codeDeployBucket: string
): string => {
  const runOnEveryBoot = `Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"\n\n`;

  const shebang = "#!/bin/bash";

  const setupLogging = `exec > >(tee /var/log/${logFile}|logger -t user-data -s 2>/dev/console) 2>&1`;

  return `${when === RunTime.EveryBoot ? runOnEveryBoot : ""}
${shebang}
${setupLogging}
yum -y update
yum install -y ${yumDependencies.join(" ")}
curl -O https://${codeDeployBucket}.s3.amazonaws.com/latest/install
chmod +x ./install
./install auto`;
};
export default getUserdata;
