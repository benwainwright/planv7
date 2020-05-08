import request from "supertest";

import { Container } from "inversify";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { APP_TYPES, Logger } from "@planv5/application/ports";
import { Server } from "http";
import { DOMParser } from "xmldom";
import { configureServer } from "./server";
import { Substitute } from "@fluffy-spoon/substitute";

describe("Application server", () => {
  let runningServer: Server;
  let client: MongoClient;
  let server: MongoMemoryServer;

  beforeEach(async () => {
    server = new MongoMemoryServer();
    const uri = await server.getConnectionString();
    client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const container = new Container();

    container
      .bind<Logger>(APP_TYPES.Logger)
      .toConstantValue(Substitute.for<Logger>());

    const appServer = await configureServer(false, container, client);
    runningServer = appServer.listen();
  });

  afterEach(
    async (): Promise<void> => {
      if (client) {
        await client.close();
      }

      if (server) {
        await server.stop();
      }
      runningServer.close();
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
});
