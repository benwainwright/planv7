import "reflect-metadata";

import { inject, injectable } from "inversify";
import { Serialisable } from "@planv7/domain";
import TYPES from "./ports/TYPES";
import Typeson from "typeson";
import date from "typeson-registry/types/date";
import error from "typeson-registry/types/error";

@injectable()
export default class Serialiser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private typeson: any;
  public constructor(
    @inject(TYPES.serialisableConstructors)
    constructors: {}
  ) {
    this.typeson = new Typeson().register([constructors, date, error]);
  }

  public serialise<T extends Serialisable>(thing: T): string {
    return this.typeson.stringify(thing);
  }

  public unSerialise<T extends Serialisable>(json: string | {}): T {
    const object = typeof json === "string" ? JSON.parse(json) : json;
    return this.typeson.revive(object);
  }
}
