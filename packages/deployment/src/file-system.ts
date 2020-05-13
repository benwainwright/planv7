import { ncp } from "ncp";
import rimraf from "rimraf";

export const copyToDirectory = async (
  from: string,
  to: string
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    ncp(from, to, (error: Error[] | null): void => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const forceDelete = async (deletePath: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line sonarjs/no-identical-functions
    rimraf(deletePath, {}, (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
