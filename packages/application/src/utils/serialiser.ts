import "reflect-metadata";

import Typeson from "typeson";
import date from "typeson-registry/types/date";
import error from "typeson-registry/types/error";

import { inject, injectable } from "inversify";
import { Serializable } from "../ports/serializable";

export const SerialisableConstructors = Symbol("serialisableConstructors");

@injectable()
export class Serialiser {
  private typeson: any;
  public constructor(
    @inject(SerialisableConstructors)
    constructors: {}
  ) {
    this.typeson = new Typeson().register([constructors, date, error]);
  }

  public serialise<T extends Serializable>(thing: T): string {
    return this.typeson.stringify(thing);
  }

  public unSerialise<T extends Serializable>(json: string): T {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    return this.typeson.revive(obj);
  }
}
