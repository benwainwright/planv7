import Cookies from "./Cookies";

describe("Cookies", (): void => {
  beforeEach((): void => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const equalsPosition = cookie.indexOf("=");
      const name =
        equalsPosition > -1 ? cookie.substr(0, equalsPosition) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });

  describe("set", (): void => {
    it("Correctly sets a cookie with a given value", (): void => {
      Cookies.set("foo", "bar", 100);
      expect(document.cookie).toEqual(expect.stringContaining("foo=bar"));
    });
  });

  describe("delete", (): void => {
    it("Deletes a previously set cookie", (): void => {
      Cookies.set("fish", "bob", 100);
      Cookies.set("foo", "bar", 100);
      Cookies.set("foobar", "sheep", 100);
      expect(document.cookie).toEqual(expect.stringContaining("foo=bar"));
      Cookies.delete("foo");
      expect(document.cookie).not.toEqual(expect.stringContaining("foo=bar"));
    });
  });

  describe("Gets the value of a cookie", (): void => {
    it("Gets the value of a cookie", (): void => {
      Cookies.set("fish", "bob", 100);
      Cookies.set("foo", "bar", 100);
      Cookies.set("foobar", "sheep", 100);
      const value = Cookies.get(document.cookie, "foo");
      expect(value).toEqual("bar");
    });
  });
});
