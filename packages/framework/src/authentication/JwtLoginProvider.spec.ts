import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { Collection, Db, MongoClient } from "mongodb";
import { TEST_PRIVATE_KEY, TEST_PUBLIC_KEY } from "../keys";

import JwtLoginProvider from "./JwtLoginProvider";
import { Logger } from "@planv7/application";
import MongoDatabaseUserRepository from "../storage/MongoDatabaseUserRepository";
import { MongoMemoryServer } from "mongodb-memory-server";
import ResponseAuthHeader from "../ResponseAuthHeader";

jest.setTimeout(600000);

describe("JwtLoginProvider", (): void => {
  let client: MongoClient;
  let server: MongoMemoryServer;
  let collection: Collection;
  let publicKey: string;
  let privateKey: string;
  let database: Db;
  beforeEach(
    async (): Promise<void> => {
      publicKey = TEST_PUBLIC_KEY;
      privateKey = TEST_PRIVATE_KEY;
      server = new MongoMemoryServer();
      const uri = await server.getConnectionString();
      client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      database = client.db(await server.getDbName());
      collection = database.collection(
        MongoDatabaseUserRepository.collectionName
      );
      await collection.insertMany([
        {
          name: "foo",
          email: "a@b.c",
          // Foobar
          password:
            "$2a$10$GQTrDmqx3RaMXu27c8Ie7.CMkXihX7lk5ECP6NMkpevoyyJyr.GTa",
        },
        {
          name: "bar",
          email: "c@d.c",
          // Hell0mr
          password:
            "$2a$10$WYx.VvtZyUx1c8JS9DYF.eknX6ffTFMc.b7xR74EIlhMqSjtHUhwa",
        },
        {
          name: "foobar",
          email: "r@f.g",
          // Carr0ts
          password:
            "$2a$10$axoWkKghx18yW3aX6HETQ.bXnJJ7iULgb1hU19cPDdZ/1s3JDUipC",
        },
      ]);
    }
  );

  afterEach(
    async (): Promise<void> => {
      await client.close();
      await server.stop();
    }
  );

  describe("login", (): void => {
    it("Sets the auth header when the login is correct", async (): Promise<
      void
    > => {
      const header = Substitute.for<ResponseAuthHeader>();
      const logger = Substitute.for<Logger>();
      const loginProvider = new JwtLoginProvider(
        database,
        publicKey,
        privateKey,
        logger,
        header
      );
      await loginProvider.login("bar", "hell0mr");
      header.received().setHeader(Arg.any());
    });

    it("Returns the correct user when the login is succesfull, including blank password field", async (): Promise<
      void
    > => {
      const header = Substitute.for<ResponseAuthHeader>();
      const logger = Substitute.for<Logger>();
      const loginProvider = new JwtLoginProvider(
        database,
        publicKey,
        privateKey,
        logger,
        header
      );
      const user = await loginProvider.login("foobar", "carr0ts");
      expect(user.getName()).toEqual("foobar");
      expect(user.getEmail()).toEqual("r@f.g");
      expect(user.getPassword()).toEqual("");
    });

    it("Throws an error and doesnt when the user doesn't exist", async (): Promise<
      void
    > => {
      const header = Substitute.for<ResponseAuthHeader>();
      const logger = Substitute.for<Logger>();
      try {
        const loginProvider = new JwtLoginProvider(
          database,
          publicKey,
          privateKey,
          logger,
          header
        );
        await loginProvider.login("foobaz", "carr0ts");
        fail("Expected an error to be thrown");
      } catch (error) {
        // Noop
      }
      header.didNotReceive().setHeader(Arg.any());
    });

    it("Throws an error and doesn't set the header when the login is incorrect", async (): Promise<
      void
    > => {
      const header = Substitute.for<ResponseAuthHeader>();
      const logger = Substitute.for<Logger>();
      try {
        const loginProvider = new JwtLoginProvider(
          database,
          publicKey,
          privateKey,
          logger,
          header
        );
        await loginProvider.login("foobar", "carrts");
      } catch (error) {
        // Noop
      }
      header.didNotReceive().setHeader(Arg.any());
    });
  });
});
