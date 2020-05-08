import { MongoClient } from "mongodb";
import { Container } from "inversify";
import { MongoMemoryServer } from "mongodb-memory-server";
import { initInjection as initClientInjection } from "../configureInjectionForClient";
import { initInjection as initServerInjection } from "../configureInjectionForServer";
import { DOMAIN_TYPES } from "@planv5/domain";
import { APP_TYPES } from "@planv5/application/ports";

process.env = Object.assign(process.env, { APP_LOG_LEVEL: "error" });

describe("Injection", (): void => {
  // Let client: MongoClient;
  // let server: MongoMemoryServer;
  // beforeEach(
  //   async (): Promise<void> => {
  //     server = new MongoMemoryServer();
  //     const uri = await server.getConnectionString();
  //     client = await MongoClient.connect(uri, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true
  //     });
  //   }
  // );
  // afterEach(
  //   async (): Promise<void> => {
  //     if (client) {
  //       await client.close();
  //     }
  //     if (server) {
  //       await server.stop();
  //     }
  //   }
  // );
  // it("Collectively satisfies all the domain interfaces", async (): Promise<
  //   void
  // > => {
  //   let serverContainer = new Container();
  //   serverContainer = await initServerInjection(serverContainer, client);
  //   configureApplicationLayerInjection(serverContainer);
  //   const failed = [];
  //   for (const type in DOMAIN_TYPES) {
  //     if (DOMAIN_TYPES.hasOwnProperty(type)) {
  //       try {
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         serverContainer.get((DOMAIN_TYPES as any)[type]);
  //       } catch (error) {
  //         failed.push(type);
  //       }
  //     }
  //   }
  //   let clientContainer = new Container();
  //   clientContainer = await initClientInjection(clientContainer);
  //   configureApplicationLayerInjection(clientContainer);
  //   for (const type of failed) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const symbol = (DOMAIN_TYPES as any)[type];
  //     clientContainer.get(symbol);
  //   }
  // });
  // it("Collectively satisfies all the application interfaces", async (): Promise<
  //   void
  // > => {
  //   let serverContainer = new Container();
  //   serverContainer = await initServerInjection(serverContainer, client);
  //   configureApplicationLayerInjection(serverContainer);
  //   const failed = [];
  //   for (const type in APP_TYPES) {
  //     if (APP_TYPES.hasOwnProperty(type)) {
  //       try {
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         serverContainer.get((APP_TYPES as any)[type]);
  //       } catch (error) {
  //         failed.push(type);
  //       }
  //     }
  //   }
  //   const clientContainer = new Container();
  //   // Ensure there is always at least one handler in the client
  //   serverContainer = await initClientInjection(clientContainer);
  //   configureApplicationLayerInjection(clientContainer);
  //   for (const type of failed) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const symbol = (APP_TYPES as any)[type];
  //     serverContainer.get(symbol);
  //   }
  // });
});
