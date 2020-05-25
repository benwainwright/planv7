import * as execa from "execa";
import * as path from "path";

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
    "--package",
    path.join(outputDir, `${name}.rpm`),
    "--output-type",
    "rpm",
    "--force",
  ];

  dependencies.forEach((dependency) => {
    baseArgs.push("--depends");
    baseArgs.push(dependency);
  });

  const pathStrings = Object.keys(paths).map(
    (pathString) => `${pathString}=${paths[pathString]}`
  );

  const args = [...baseArgs, ...pathStrings];

  return execa.command(args.join(" "));
};

export default buildRpm;
