import * as React from "react";
import Adapter from "enzyme-adapter-react-16";
import Register from "./Register";
import { configure } from "enzyme";
import { createMount } from "@material-ui/core/test-utils";

configure({ adapter: new Adapter() });

describe("Register page", () => {
  describe("Clear button", () => {
    it("Must be invisible if the page is clean", () => {
      const mount = createMount();
      const form = mount(<Register />);

      const clear = form.find({ id: "clearButton" }).find("button");

      expect(clear.length).toBe(0);
    });

    it("Must be visible if the username changes", () => {
      const mount = createMount();
      const form = mount(<Register />);

      form
        .find({ id: "username" })
        .find("input")
        .simulate("change", { target: { value: "foobar" } });

      const clear = form.find({ id: "clearButton" }).find("button");

      expect(clear.length).toBe(1);
    });

    it("Must be visible if the password changes", () => {
      const mount = createMount();
      const form = mount(<Register />);

      form
        .find({ id: "password" })
        .find("input")
        .simulate("change", { target: { value: "foobar" } });

      const clear = form.find({ id: "clearButton" }).find("button");

      expect(clear.length).toBe(1);
    });
  });
});
