import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./Form";
import TextField from "@material-ui/core/TextField";
import { act } from "react-dom/test-utils";

const editFieldByTestId = (testId: string, value: string): void => {
  fireEvent.change(screen.getByTestId(testId), { target: { value } });
};

describe("The Form component", () => {
  describe("The Clear button", () => {
    it("Must be invisible if the page is clean before it has been edited", () => {
      act(() => {
        render(
          <Form>
            <TextField label="Field One" />
            <TextField label="Field Two" />
            <TextField label="Field Three" />
          </Form>
        );
      });
      expect(screen.queryByText("Clear")).toBeNull();
    });

    it("Must be visible if any fields have been edited", () => {
      act(() => {
        render(
          <Form>
            <TextField
              label="Field One"
              inputProps={{ "data-testid": "one" }}
            />
            <TextField
              label="Field Two"
              inputProps={{ "data-testid": "two" }}
            />
            <TextField
              label="Field Three"
              inputProps={{ "data-testid": "three" }}
            />
          </Form>
        );

        editFieldByTestId("one", "foo");
        editFieldByTestId("three", "bar");
      });

      expect(screen.queryByText("Clear")).not.toBeNull();
    });

    it("Must dissapear if all the fields change to empty", () => {
      act(() => {
        render(
          <Form>
            <TextField
              label="Field One"
              name="one"
              inputProps={{ "data-testid": "one" }}
            />
            <TextField
              label="Field Two"
              name="two"
              inputProps={{ "data-testid": "two" }}
            />
            <TextField
              label="Field Three"
              name="three"
              inputProps={{ "data-testid": "three" }}
            />
          </Form>
        );

        editFieldByTestId("one", "foo");
      });
      act(() => {
        editFieldByTestId("two", "bif");
      });
      act(() => {
        editFieldByTestId("three", "bar");
      });

      act(() => {
        editFieldByTestId("one", "");
      });
      act(() => {
        editFieldByTestId("two", "");
      });
      act(() => {
        editFieldByTestId("three", "");
      });

      expect(screen.queryByText("Clear")).toBeNull();
    });
  });
});
