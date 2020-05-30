import { Logger } from "@choirpractise/application";

const getKey = (envVar: string, defaultKey: string, logger: Logger): string => {
  if (process.env[envVar]) {
    return process.env[envVar] ?? "";
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(`Please define the ${envVar} environment variable`);
  }

  logger.warning(
    `${envVar} is not set in environment; using test key - NOT TO BE USED FOR PRODUCTION PURPOSES`
  );
  return defaultKey;
};

export default getKey;
