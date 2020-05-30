/* eslint-disable sonarjs/no-duplicate-string */

import { Db, MongoClient } from "mongodb";
import { Deadline, Plan, User } from "@choirpractise/domain";

import { Logger } from "@choirpractise/application";
import MongoDatabasePlanRepository from "../MongoDatabasePlanRepository";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Substitute } from "@fluffy-spoon/substitute";

describe("MongoDbPlanRepository", (): void => {
  // eslint-disable-next-line fp/no-let
  let client: MongoClient;

  // eslint-disable-next-line fp/no-let
  let server: MongoMemoryServer;

  // eslint-disable-next-line fp/no-let
  let database: Db;

  beforeEach(
    async (): Promise<void> => {
      server = new MongoMemoryServer();
      const uri = await server.getConnectionString();
      client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      database = client.db(await server.getDbName());
      const collection = database.collection(
        MongoDatabasePlanRepository.collectionName
      );
      await collection.insertMany([
        {
          user: "foo",
          slug: "plan1",
          title: "plan1",
          description: "description one",
          hoursPerWeek: 4,
          deadlines: [],
        },
        {
          user: "bar",
          slug: "plan2",
          title: "plan2",
          description: "description two",
          hoursPerWeek: 7,
          deadlines: [
            {
              name: "fooDeadline",
              link: "https://www.google.com",
              ratio: 1,

              // 5th of September 2019 14:23:09
              due: 1567693389,
            },
            {
              name: "barDeadline",
              link: "https://www.github.com",
              ratio: 2,

              // 9th of september 2019 11:09:59
              due: 1568286599,
            },
          ],
        },
        {
          user: "foo",
          title: "plan3",
          slug: "plan3",
          description: "description three",
          hoursPerWeek: 8,
          deadlines: [
            {
              name: "bazDeadline",
              link: "https://www.bbc.com",
              ratio: 0.5,
              // 1st of january 2023 02:45:23
              due: 1672541123,
            },
          ],
        },
        {
          user: "foo",
          title: "plan4",
          slug: "plan4",
          description: "description four",
          hoursPerWeek: 2,
          deadlines: [],
        },
        {
          user: "bar",
          title: "plan5",
          slug: "plan5",
          description: "description five",
          hoursPerWeek: 1,
          deadlines: [
            {
              name: "bopdeadline",
              link: "https://www.bbc.com",
              ratio: 1,
              //7th of August 1984 18::37:33
              due: 458159853,
            },
          ],
        },
        {
          user: "bar",
          title: "plan6",
          slug: "plan6",
          description: "description six",
          hoursPerWeek: 1,
          deadlines: [],
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

  describe("Get all by user", (): void => {
    it("Gets all plans for that user and nothing else", async (): Promise<
      void
    > => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const user = new User("bar", "a@b.c", "foobar");
      const output = await repo.getAllByUser(user);
      expect(output.length).toEqual(3);
      expect(output).toEqual(
        expect.arrayContaining([
          new Plan("bar", "plan2", "plan2", "description two", 7, [
            new Deadline(
              "fooDeadline",
              1,
              new Date(1567693389 * 1000),
              new URL("https://www.google.com")
            ),
            new Deadline(
              "barDeadline",
              2,
              new Date(1568286599 * 1000),
              new URL("https://www.github.com")
            ),
          ]),
          new Plan("bar", "plan5", "plan5", "description five", 1, [
            new Deadline(
              "bopdeadline",
              1,
              new Date(458159853 * 1000),
              new URL("https://www.bbc.com")
            ),
          ]),
          new Plan("bar", "plan6", "plan6", "description six", 1, []),
        ])
      );
    });

    it("Returns an empty list if there are no plans", async (): Promise<
      void
    > => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const user = new User("bebop", "a@b.c", "foobar");
      const output = await repo.getAllByUser(user);
      expect(output).toBeDefined();
      expect(output.length).toEqual(0);
    });
  });

  describe("Get by field and user", () => {
    it("Allows me to get a plan by name", async () => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const user = new User("foo", "email", "bar");
      const output = await repo.getByFieldAndUser(user, "slug", "plan4");
      expect(output).toEqual(
        new Plan("foo", "plan4", "plan4", "description four", 2, [])
      );
    });

    it("Returns undefined if the wrong user is specified", async () => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const user = new User("fooBar", "email", "bar");
      const output = await repo.getByFieldAndUser(user, "slug", "plan4");
      expect(output).toBeUndefined();
    });
  });

  describe("Get by field", () => {
    it("Allows me to get a plan by name", async (): Promise<void> => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const output = await repo.getByField("slug", "plan4");
      expect(output).toEqual(
        new Plan("foo", "plan4", "plan4", "description four", 2, [])
      );
    });

    it("Returns undefined if plan doesn't exist", async (): Promise<void> => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const output = await repo.getByField("name", "blah");
      expect(output).toBeUndefined();
    });
  });

  describe("Save new", () => {
    it("Correctly saves a plan into the database that can be correctly reconstructed", async (): Promise<
      void
    > => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const newPlan = new Plan("bar", "plan9", "plan9", "description nine", 1, [
        new Deadline(
          "bopdeadline",
          1,
          new Date(458159854 * 1000),
          new URL("https://www.bbc.com")
        ),
      ]);
      await repo.saveNew(newPlan);

      const retreived = await repo.getByField("slug", "plan9");
      expect(retreived).toEqual(newPlan);
    });
  });

  describe("Update existing", () => {
    it("Results in a record being updated", async () => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      await repo.updateExisting(
        new Plan("fooUser", "plan6", "fooTitle", "fooDescription", 0)
      );
      const plans = await repo.getAll();
      expect(plans.length).toEqual(6);

      const plan = await repo.getByField("slug", "plan6");
      expect(plan).toBeDefined();
      if (plan) {
        expect(plan.getTitle()).toEqual("fooTitle");
        expect(plan.getUser()).toEqual("fooUser");
        expect(plan.getDescription()).toEqual("fooDescription");
      }
    });
  });

  describe("Delete existing", () => {
    it("Removes a record from the collection", async () => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      await repo.deleteExisting(
        new Plan("fooUser", "plan6", "fooTitle", "fooDescription", 0)
      );

      const plans = await repo.getAll();
      expect(plans.length).toEqual(5);
      const plan = await repo.getByField("slug", "plan6");
      expect(plan).toBeUndefined();
    });
  });

  describe("Get all", (): void => {
    it("Gets the correct amount of records", async (): Promise<void> => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const plans = await repo.getAll();
      expect(plans.length).toEqual(6);
    });

    it("Gets at least a few known records", async (): Promise<void> => {
      const logger = Substitute.for<Logger>();
      const repo = new MongoDatabasePlanRepository(database, logger);
      const plans = await repo.getAll();
      expect(plans).toEqual(
        expect.arrayContaining([
          new Plan("bar", "plan2", "plan2", "description two", 7, [
            new Deadline(
              "fooDeadline",
              1,
              new Date(1567693389 * 1000),
              new URL("https://www.google.com")
            ),
            new Deadline(
              "barDeadline",
              2,
              new Date(1568286599 * 1000),
              new URL("https://www.github.com")
            ),
          ]),
          new Plan("foo", "plan4", "plan4", "description four", 2, []),
        ])
      );
    });
  });
});
