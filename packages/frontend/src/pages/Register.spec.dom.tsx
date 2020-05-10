import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Register from "./Register";
import { act } from "react-dom/test-utils";

describe("Register page", () => {
  describe("Clear button", () => {
    it("Must be invisible if the page is clean", () => {
      act(() => {
        render(<Register />);
      });
      expect(screen.queryByText("Clear")).toBeNull();
    });

    it("Must be visible if the username has been edited", () => {
      act(() => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText("Username"), {
          target: {
            value: "foobar",
          },
        });
      });
      expect(screen.queryByText("Clear")).not.toBeNull();
    });

    it("Must be visible if the password has been edited", () => {
      act(() => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText("Password"), {
          target: {
            value: "foobar",
          },
        });
      });
      expect(screen.queryByText("Clear")).not.toBeNull();
    });

    it("Must be visible if the verifyPassword field has been edited", () => {
      act(() => {
        render(<Register />);
        fireEvent.change(screen.getByLabelText("Verify password"), {
          target: {
            value: "foobar",
          },
        });
      });
      expect(screen.queryByText("Clear")).not.toBeNull();
    });

    /* it("Must dissapear if all fields change to empty", async () => { */
    /*   await act(async () => { */
    /*     render(<Register />); */
    /*     const changeValue = { */
    /*       target: { */
    /*         value: "foobar", */
    /*       }, */
    /*     }; */

    /*     fireEvent.change(screen.getByTestId("username"), changeValue); */
    /*     fireEvent.change(screen.getByTestId("password"), changeValue); */
    /*     fireEvent.change(screen.getByTestId("verifyPassword"), changeValue); */
    /*   }); */
    /*   await act(async () => { */
    /*     const clearValue = { */
    /*       taret: { */
    /*         value: "", */
    /*       }, */
    /*     }; */

    /*     fireEvent.change(screen.getByTestId("username"), clearValue); */
    /*     fireEvent.change(screen.getByTestId("password"), clearValue); */
    /*     fireEvent.change(screen.getByTestId("verifyPassword"), clearValue); */
    /*   }); */

    /*   expect(screen.queryByText("Clear")).toBeNull(); */
    /* }); */

    it("Must set all fields to empty when clicked", () => {
      act(() => {
        render(<Register />);
        const changeValue = {
          target: {
            value: "new value",
          },
        };
        fireEvent.change(screen.getByTestId("username"), changeValue);
        fireEvent.change(screen.getByTestId("password"), changeValue);
        fireEvent.change(screen.getByTestId("verifyPassword"), changeValue);
      });

      act(() => {
        fireEvent.click(screen.getByText("Clear"));
      });

      expect(screen.getByTestId("username")).toHaveValue("");
      expect(screen.getByTestId("password")).toHaveValue("");
      expect(screen.getByTestId("verifyPassword")).toHaveValue("");
    });
  });
});
