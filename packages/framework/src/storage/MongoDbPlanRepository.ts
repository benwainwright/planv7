import "reflect-metadata";
import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  Logger,
} from "@planv7/application";
import { Collection, Db } from "mongodb";
import { Deadline, Plan, User } from "@planv7/domain";
import { inject, injectable } from "inversify";

import TYPES from "../TYPES";

const THOUSAND_MILLISECONDS_IN_SECOND = 1000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDataToPlan = (planData: any): Plan => {
  return new Plan(
    planData.user,
    planData.slug,
    planData.title,
    planData.description,
    planData.hoursPerWeek,
    planData.deadlines
      ? planData.deadlines.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (d: any): Deadline =>
            new Deadline(
              d.name,
              d.ratio,
              new Date(d.due * THOUSAND_MILLISECONDS_IN_SECOND),
              new URL(d.link)
            )
        )
      : []
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapPlanToObject = (plan: Plan): any => ({
  user: plan.getUser(),
  slug: plan.getSlug(),
  title: plan.getTitle(),
  description: plan.getDescription(),
  hoursPerWeek: plan.getHoursPerWeek(),
  deadlines: plan.getDeadlines()
    ? plan.getDeadlines().map((deadline: Deadline): {
        name: string;
        link: string;
        ratio: number;
        due: number;
      } => {
        const link = deadline.getLink();
        return {
          name: deadline.getName(),
          link: link ? link.toString() : "",
          ratio: deadline.getRatio(),
          due: deadline.getDue().getTime() / THOUSAND_MILLISECONDS_IN_SECOND,
        };
      })
    : [],
});

@injectable()
export default class MongoDbPlanRepository
  implements AuthenticatedEntityRepository<Plan> {
  public static readonly collectionName = "Plans";
  private readonly collection: Collection;
  private readonly logger: Logger;

  public constructor(
    @inject(TYPES.db) database: Db,
    @inject(APP.logger) logger: Logger
  ) {
    this.collection = database.collection(MongoDbPlanRepository.collectionName);
    this.logger = logger;
  }

  public async getByFieldAndUser<V>(
    user: User,
    name: string,
    value: V
  ): Promise<Plan | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { user: user.getName() };
    query[name] = value;
    const result = await this.collection.findOne(query);

    if (!result) {
      return null;
    }

    return mapDataToPlan(result);
  }

  public async getAllByUser(user: User): Promise<Plan[]> {
    const plans = await this.collection
      .find({ user: user.getName() })
      .toArray();

    return plans.map(mapDataToPlan);
  }

  public async deleteExisting(plan: Plan): Promise<void> {
    await this.collection.deleteOne({ slug: plan.getSlug() });
  }

  public async updateExisting(plan: Plan): Promise<void> {
    await this.collection.updateOne(
      { slug: plan.getSlug() },
      { $set: mapPlanToObject(plan) }
    );
  }

  public async saveNew(plan: Plan): Promise<void> {
    await this.collection.insertOne(mapPlanToObject(plan));
  }

  public async getByField<V>(name: string, value: V): Promise<Plan | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    query[name] = value;
    const result = await this.collection.findOne(query);

    if (!result) {
      return null;
    }

    return mapDataToPlan(result);
  }

  public async getAll(): Promise<Plan[]> {
    const plans = await this.collection.find().toArray();
    return plans.map(mapDataToPlan);
  }
}
