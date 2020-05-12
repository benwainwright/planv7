/* eslint-disable no-console */
import axios from "axios";

const HTTP_OK = 200;
const ONE_SECOND = 1000;

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const url = process.argv[2];
console.log(`Polling ${url}`);
setInterval(async () => {
  try {
    const response = await axios.get(url);
    if (response.status === HTTP_OK) {
      console.log("200 status code received!");
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit();
    } else {
      console.log("Not ready...");
    }
  } catch (error) {
    console.log("Not ready...");
  }
}, ONE_SECOND);
