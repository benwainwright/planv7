export const getKey = (keyEnvironmentVar: string, defaultKey: string): string => {
  if (process.env[keyEnvironmentVar]) {
    return process.env[keyEnvironmentVar] as string;
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Must specify ${keyEnvironmentVar}`);
    }
    return defaultKey;
  }
};
