import deepEqual from "deep-equal";
import { Serialiser } from "./typesonSerialiser";

describe("The serialiser", () => {
  class Foo {
    x: string;
    public method() {}
  }

  it("Serialises a class object so that it can be unserialized properly", () => {
    const foo = new Foo();
    foo.x = "bar";

    const serialiser = new Serialiser({ Foo });
    const json = serialiser.serialise(foo);
    const newObj = serialiser.unSerialise(json);

    expect(deepEqual(foo, newObj)).toBeTruthy();
    expect(newObj).toBeInstanceOf(Foo);
  });
});
