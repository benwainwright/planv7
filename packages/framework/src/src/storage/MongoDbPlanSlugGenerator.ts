import { APP_TYPES , Logger, SlugGenerator } from "@planv5/application/ports";
import { inject, injectable } from "inversify";
import { FRAMEWORK_TYPES } from "../../types";

import { Plan } from "@planv5/domain/entities";
import { Collection, Db } from "mongodb";
import { PLANS_COLLECTION_NAME } from "./MongoDbPlanRepository";

@injectable()
export class MongoDbPlanSlugGenerator implements SlugGenerator<Plan> {
  private readonly collection: Collection;
  private readonly logger: Logger;
  public constructor(
    @inject(FRAMEWORK_TYPES.Db) database: Db,
    @inject(APP_TYPES.Logger) logger: Logger
  ) {
    this.collection = database.collection(PLANS_COLLECTION_NAME);
    this.logger = logger;
  }

  public async getUniqueSlug(thing: Plan): Promise<string> {
    const title = thing.getTitle() || "item";

    const encodedTitle = encodeURIComponent(title.trim().replace(" ", "-"));

    const plans = await this.collection.findOne({ slug: encodedTitle });

    if (plans === null || plans === undefined) {
      return encodedTitle;
    } else {
      const lastChar = encodedTitle.charAt(encodedTitle.length - 1);
      const isNumber = /^\d$/.test(lastChar);

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
