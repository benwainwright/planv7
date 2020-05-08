import * as execa from "execa";
import Koa from "koa";
import { Server } from "http";
import fs from "fs";
import request from "supertest";

import statics from "./statics";

describe("The statics application route", () => {
  let server: Server;

  const oldCwd = process.cwd();

  const oldNodeEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    process.env.NODE_ENV = "production";
    const { stdout: tempDir } = await execa.command("mktemp -d");
    process.chdir(tempDir);
    const mockBundleDir = `${process.cwd()}/dist/assets`;
    fs.mkdirSync(mockBundleDir, { recursive: true });
    const fakeJsString = "if(true) { console.log('this is some Javascript!); }";
    fs.writeFileSync(`${mockBundleDir}/app.js`, fakeJsString);
  });

  afterEach(async () => {
    await execa.command("rm -rf $PWD");
    process.chdir(oldCwd);
    server.close();
    process.env.NODE_ENV = oldNodeEnv;
  });

  describe("Static bundle path", () => {
    it("Should return a 200 response", async () => {
      const koaApp = new Koa();
      koaApp.use(await statics());
      server = koaApp.listen();
      const response = await request(server).get("/assets/app.js");
      expect(response.status).toEqual(200);
      server.close();
    });

    it("Should return an application/javascript content-type header", async () => {
      const koaApp = new Koa();
      koaApp.use(await statics());
      server = koaApp.listen();
      const response = await request(server).get("/assets/app.js");
      expect(response.header["content-type"]).toContain(
        "application/javascript"
      );
      server.close();
    });

    it("Should return valid javascript", async () => {
      const koaApp = new Koa();
      koaApp.use(await statics());
      server = koaApp.listen();
      const response = await request(server).get("/assets/main.js");
      // eslint-disable-next-line no-eval
      expect(() => eval(response.body)).not.toThrowError();
      server.close();
    });
  });
});
