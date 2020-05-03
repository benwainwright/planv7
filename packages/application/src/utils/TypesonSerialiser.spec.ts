/* eslint-disable filenames/match-regex */
import Serialiser from "./TypesonSerialiser";
import deepEqual from "deep-equal";

describe("The serialiser", () => {
  class Foo {
    public x: string = "";
    public method(): void {
      // eslint-disable @typescript-eslint/no-empty-function
    }
  }

  it("Serialises a class object so that it can be unserialized properly", () => {
    const foo = new Foo();
    foo.x = "bar";

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const serialiser = new Serialiser({ Foo });
    const json = serialiser.serialise(foo);
    const newObj = serialiser.unSerialise(json);

    expect(deepEqual(foo, newObj)).toBeTruthy();
    expect(newObj).toBeInstanceOf(Foo);
  });
});
