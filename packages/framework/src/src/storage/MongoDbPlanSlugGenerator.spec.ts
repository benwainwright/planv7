import { Db, MongoClient } from "mongodb";

import { Logger } from "@planv7/application";
import MongoDbPlanSlugGenerator from "./MongoDbPlanSlugGenerator";
import { MongoMemoryServer } from "mongodb-memory-server";
import { PLANS_COLLECTION_NAME } from "./MongoDbPlanRepository";
import { Plan } from "@planv7/domain";
import { mock } from "jest-mock-extended";

describe("The slug generator", () => {
  let client: MongoClient;
  let server: MongoMemoryServer;
  let db: Db;
  beforeEach(
    async (): Promise<void> => {
      server = new MongoMemoryServer();
      const uri = await server.getConnectionString();
      client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = client.db(await server.getDbName());
      const collection = db.collection(PLANS_COLLECTION_NAME);
      await collection.insertMany([
        {
          user: "foo",
          slug: "plan",
          title: "plan1",
          description: "description one",
          hoursPerWeek: 4,
          deadlines: [],
        },
        {
          user: "foo",
          slug: "planny1",
          title: "plan1",
          description: "description one",
          hoursPerWeek: 4,
          deadlines: [],
        },
      ]);
    }
  );
  it("returns the title if the slug doesn't exist", async () => {
    const logger = mock<Logger>();
    const generator = new MongoDbPlanSlugGenerator(db, logger);
    const plan = new Plan("foo", "", "fooTitle", "", 0);
    const slug = await generator.getUniqueSlug(plan);
    expect(slug).toEqual("fooTitle");
  });

  it("replaces spaces with dashes", async () => {
    const logger = mock<Logger>();
    const generator = new MongoDbPlanSlugGenerator(db, logger);
    const plan = new Plan("foo", "", "foo title", "", 0);
    const slug = await generator.getUniqueSlug(plan);
    expect(slug).toEqual("foo-title");
  });

  it("Adds a number on the end of slug already exists", async () => {
    const logger = mock<Logger>();
    const generator = new MongoDbPlanSlugGenerator(db, logger);
    const plan = new Plan("foo", "", "plan", "", 0);
    const slug = await generator.getUniqueSlug(plan);
    expect(slug).toEqual("plan1");
  });

  it("Increments the number of the slug already has a number on the end", async () => {
    const logger = mock<Logger>();
    const generator = new MongoDbPlanSlugGenerator(db, logger);
    const plan = new Plan("foo", "", "planny1", "", 0);
    const slug = await generator.getUniqueSlug(plan);
    expect(slug).toEqual("planny2");
  });
});
