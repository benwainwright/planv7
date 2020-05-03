import { TYPES as APP, Logger, SlugGenerator } from "@planv7/application";
import { Collection, Db } from "mongodb";
import { inject, injectable } from "inversify";

import { PLANS_COLLECTION_NAME } from "./MongoDbPlanRepository";
import { Plan } from "@planv7/domain";
import TYPES from "../../TYPES";

@injectable()
export default class MongoDbPlanSlugGenerator implements SlugGenerator<Plan> {
  private readonly collection: Collection;
  private readonly logger: Logger;
  public constructor(
    @inject(TYPES.db) database: Db,
    @inject(APP.logger) logger: Logger
  ) {
    this.collection = database.collection(PLANS_COLLECTION_NAME);
    this.logger = logger;
  }

  public async getUniqueSlug(thing: Plan): Promise<string> {
    const title = thing.getTitle() || "item";

    const encodedTitle = encodeURIComponent(title.trim().replace(" ", "-"));

    const plans = await this.collection.findOne({ slug: encodedTitle });

    if (!plans) {
      return encodedTitle;
    } else {
      const lastChar = encodedTitle.charAt(encodedTitle.length - 1);
      const isNumber = /^\d$/u.test(lastChar);

      if (isNumber) {
        const number = parseInt(lastChar, 10);
        const prefix = encodedTitle.substring(0, encodedTitle.length - 1);
        return `${prefix}${number + 1}`;
      } else {
        return `${encodedTitle}1`;
      }
    }
  }
}
