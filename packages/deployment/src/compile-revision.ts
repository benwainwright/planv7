import * as path from "path";
import rimraf from "rimraf";
import { promises as fs } from "fs";
import { ncp } from "ncp";

const APPSPEC_NAME = "appspec.yml";

const serverPath = path.join(__dirname, "../../../packages/backend/dist");
const frontendPath = path.join(__dirname, "../../../packages/frontend/dist");

const copyToDirectory = async (from: string, to: string): Promise<void> => {
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

const forceDelete = async (path: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    rimraf(path, {}, (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

(async (): Promise<void> => {
  const revisonPath = path.join(__dirname, "../revision");
  await forceDelete(revisonPath);
  await fs.mkdir(revisonPath);

  await copyToDirectory(serverPath, revisonPath);
  await copyToDirectory(frontendPath, revisonPath);

  await fs.copyFile(
    path.join(__dirname, APPSPEC_NAME),
    path.join(revisonPath, APPSPEC_NAME)
  );

  // eslint-disable-next-line no-console
})().catch((error: Error) => console.log(error));
