import * as execa from "execa";

const buildRpm = async (
  name: string,
  dependencies: string[],
  paths: { [path: string]: string },
  outputDir: string
): Promise<execa.ExecaReturnValue> => {
  const baseArgs = [
    "fpm",
    "--input-type",
    "dir",
    "--name",
    name,
    "--prefix",
    outputDir,
    "--output-type",
    "rpm",
    "--force",
  ];

  dependencies.forEach((dependency) => {
    baseArgs.push("--depends");
    baseArgs.push(dependency);
  });

  const pathStrings = Object.keys(paths).map(
    (path) => `${path}=${paths[path]}`
  );

  const args = [...baseArgs, ...pathStrings];

  console.log(args.join(" "));

  return execa.command(args.join(" "));
};

export default buildRpm;
