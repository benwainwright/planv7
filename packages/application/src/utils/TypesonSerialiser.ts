import Typeson from "typeson";

import date from "typeson-registry/types/date";

import error from "typeson-registry/types/error";

export default class TypesonSerialiser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private typeson: any;

  public constructor(constructors: {}) {
    this.typeson = new Typeson().register([constructors, date, error]);
  }

  public serialise = <T>(thing: T): string => {
    const objectifyClass = this.typeson.encapsulate(thing);
    return JSON.stringify(objectifyClass);
  };

  public unSerialise = <T>(json: string): T => {
    const parsed = JSON.parse(json);
    return this.typeson.revive(parsed);
  };
}
