// @ts-ignore
import Typeson from "typeson";

// @ts-ignore
import date from "typeson-registry/types/date";

// @ts-ignore
import error from "typeson-registry/types/error";

export default class Serialiser {
  private typeson: any;

  constructor(constructors: {}) {
    this.typeson = new Typeson().register([constructors, date, error]);
  }

  public serialise = (thing: any): string => {
    const objectifyClass = this.typeson.encapsulate(thing);
    return JSON.stringify(objectifyClass);
  };

  public unSerialise = (json: string): any => {
    console.log(json);
    const parsed = JSON.parse(json);
    return this.typeson.revive(parsed);
  };
}
