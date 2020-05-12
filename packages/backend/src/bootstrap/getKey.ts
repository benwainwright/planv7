import { Logger } from "@planv7/application";
import { readFile } from "fs";

const getKey = async (
  pathEnvVar: string,
  defaultKey: string,
  logger: Logger
): Promise<string> => {
  return new Promise((resolve, reject): void => {
    if (process.env[pathEnvVar]) {
      readFile(
        process.env[pathEnvVar] || "",
        "utf8",
        (error: NodeJS.ErrnoException | null, data: string): void => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
      return;
    }

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Please define the ${pathEnvVar} environment variable`);
    }

    logger.warning(
      `${pathEnvVar} is not set in environment; using test key - NOT TO BE USED FOR PRODUCTION PURPOSES`
    );
    resolve(defaultKey);
  });
};

export default getKey;
