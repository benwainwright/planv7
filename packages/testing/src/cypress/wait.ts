/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
import axios from "axios";

const HTTP_OK = 200;
const TIMEOUT = 30;
const ONE_SECOND = 1000;

setTimeout(() => {
  console.log(`Timed out after ${TIMEOUT} seconds`);
  process.exit(1);
}, ONE_SECOND * TIMEOUT);

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const url = process.argv[2];
console.log(`Polling ${url}`);
setInterval(async () => {
  try {
    const response = await axios.get(url);
    if (response.status === HTTP_OK) {
      console.log("200 status code received!");
      process.exit();
    } else {
      console.log("Not ready...");
    }
  } catch (error) {
    console.log("Not ready...");
  }
}, ONE_SECOND);
