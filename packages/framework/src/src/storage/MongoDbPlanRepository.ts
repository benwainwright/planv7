import "reflect-metadata";
import { inject, injectable } from "inversify";
import { Collection, Db } from "mongodb";

import {
  TYPES as APP,
  AuthenticatedEntityRepository,
  Logger,
} from "@planv7/application";

import { Deadline, Plan, User } from "@planv7/domain";
import { FRAMEWORK_TYPES } from "../../types";

export const PLANS_COLLECTION_NAME = "Plans";

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
              new Date(d.due * 1000),
              new URL(d.link)
            )
        )
      : []
  );
};

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
        console.log(plan);
        console;
        const link = deadline.getLink();
        return {
          name: deadline.getName(),
          link: link ? link.toString() : "",
          ratio: deadline.getRatio(),
          due: deadline.getDue().getTime() / 1000,
        };
      })
    : [],
});

@injectable()
export class MongoDbPlanRepository
  implements AuthenticatedEntityRepository<Plan> {
  private readonly collection: Collection;
  private readonly logger: Logger;

  public constructor(
    @inject(FRAMEWORK_TYPES.Db) database: Db,
    @inject(APP.Logger) logger: Logger
  ) {
    this.collection = database.collection(PLANS_COLLECTION_NAME);
    this.logger = logger;
  }

  public async getByFieldAndUser<V>(
    user: User,
    name: string,
    value: V
  ): Promise<Plan | undefined> {
    const query: any = { user: user.getName() };
    query[name] = value;
    const result = await this.collection.findOne(query);

    if (result === null || result === undefined) {
      return undefined;
    }

    return mapDataToPlan(result);
  }

  public async getAllByUser(user: User): Promise<Plan[]> {
    const plans = await this.collection
      .find({ user: user.getName() })
      .toArray();

    return plans.map(mapDataToPlan);
  }

  public async deleteExisting(plan: Plan) {
    await this.collection.deleteOne({ slug: plan.getSlug() });
  }

  public async updateExisting(plan: Plan) {
    await this.collection.updateOne(
      { slug: plan.getSlug() },
      { $set: mapPlanToObject(plan) }
    );
  }

  public async saveNew(plan: Plan): Promise<void> {
    await this.collection.insertOne(mapPlanToObject(plan));
  }

  public async getByField<V>(
    name: string,
    value: V
  ): Promise<Plan | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    query[name] = value;
    const result = await this.collection.findOne(query);

    if (result === null || result === undefined) {
      return undefined;
    }

    return mapDataToPlan(result);
  }

  public async getAll(): Promise<Plan[]> {
    const plans = await this.collection.find().toArray();
    return plans.map(mapDataToPlan);
  }
}
