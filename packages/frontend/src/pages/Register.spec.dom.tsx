import * as React from "react";
import { render, screen } from "@testing-library/react";
import Adapter from "enzyme-adapter-react-16";
import Register from "./Register";
import { configure } from "enzyme";

configure({ adapter: new Adapter() });

describe("Register page", () => {
  describe("Clear button", () => {
    it("Must be invisible if the page is clean", () => {
      render(<Register />);

      expect(screen.queryByText("Clear")).toBeNull();
    });
  });
});
