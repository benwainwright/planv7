import { TYPES as APP, Logger } from "@planv7/application";
import initialiseServer, { InitialisationResult } from "./initialiseServer";
import { Container } from "inversify";
import { DOMParser } from "xmldom";
import { Server } from "http";
import { Substitute } from "@fluffy-spoon/substitute";
import request from "supertest";

describe("Application server", () => {
  let runningServer: Server;
  let result: InitialisationResult | undefined;

  beforeEach(async () => {
    const container = new Container();

    container
      .bind<Logger>(APP.logger)
      .toConstantValue(Substitute.for<Logger>());

    process.env.USE_MONGO_MEMORY_SERVER = "true";

    result = await initialiseServer();
    if (result.koaApp) {
      runningServer = result.koaApp.listen();
    }
  });

  afterEach(
    async (): Promise<void> => {
      delete process.env.USE_MONGO_MEMORY_SERVER;
      runningServer.close();
      result?.cleanupHandlers?.forEach((cleanUp) => cleanUp())
    }
  );

  describe("Root path ('/')", () => {
    it("Should redirect to /app", async () => {
      const response = await request(runningServer).get("/");
      expect(response.status).toEqual(302);
      expect(response.header["location"]).toEqual("/app");
    });
  });

  describe("Application home ('/app')", () => {
    it("Should return a text/html content-type header", async () => {
      const response = await request(runningServer).get("/app");
      expect(response.header["content-type"]).toContain("text/html");
    });

    it("Should return a 200 response", async () => {
      const response = await request(runningServer).get("/app");
      expect(response.status).toEqual(200);
    });

    it("Should return an html string", async () => {
      const response = await request(runningServer).get("/app");
      const parser = new DOMParser();
      const parsed = parser.parseFromString(response.text, "text/xml");

      expect(parsed.documentElement.nodeName).toEqual("html");
    });
  });

  describe("The other route ('/app/other)", () => {
    it("Should return a 200 response", async () => {
      const response = await request(runningServer).get("/app/other");
      expect(response.status).toEqual(200);
    });

    it("Should return a text/html content-type header", async () => {
      const response = await request(runningServer).get("/app/other");
      expect(response.header["content-type"]).toContain("text/html");
    });

    it("Should return an html string", async () => {
      const response = await request(runningServer).get("/app/other");
      const parser = new DOMParser();
      const parsed = parser.parseFromString(response.text, "text/xml");

      expect(parsed.documentElement.nodeName).toEqual("html");
    });
  });

  describe("The auth route", () => {
    it("Should return 403 when attempting to post without credentials", async () => {
      const response = await request(runningServer).post("/auth");
      expect(response.status).toEqual(403);
    });
  });
});
