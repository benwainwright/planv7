import request from "supertest";
import Koa from "koa";

import { Server } from "http";
import fs from "fs";

import { configureStaticsRoute } from "./statics";

jest.mock("fs", () => require("../../../tests/utils/fsMock").mock());

describe("The statics application route", () => {
  let server: Server;

  beforeEach(async () => {
    const mockBundleDir = `${process.cwd()}/dist/assets`;
    fs.mkdirSync(mockBundleDir, { recursive: true });
    const fakeJsString = "if(true) { console.log('this is some Javascript!); }";
    fs.writeFileSync(`${mockBundleDir}/app.js`, fakeJsString);
    const koaApp = new Koa();
    koaApp.use(await configureStaticsRoute(false));
    server = koaApp.listen();
  });

  afterEach(() => {
    require("../../../tests/utils/fsMock").reset();
    server.close();
  });

  describe("Static bundle path", () => {
    it("Should return a 200 response", async () => {
      const response = await request(server).get("/assets/app.js");
      expect(response.status).toEqual(200);
    });

    it("Should return an application/javascript content-type header", async () => {
      const response = await request(server).get("/assets/app.js");
      expect(response.header["content-type"]).toContain(
        "application/javascript"
      );
    });

    it("Should return valid javascript", async () => {
      const response = await request(server).get("/assets/main.js");
      expect(() => eval(response.body)).not.toThrowError();
    });
  });
});
