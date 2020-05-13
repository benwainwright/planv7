import * as path from "path";
import { promises as fs } from "fs";
import { ncp } from "ncp";

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

(async (): Promise<void> => {
  const revisonPath = path.join(__dirname, "../revision");
  await fs.mkdir(revisonPath);

  await copyToDirectory(serverPath, revisonPath);
  await copyToDirectory(frontendPath, revisonPath);

  // eslint-disable-next-line no-console
})().catch((error: Error) => console.log(error));
