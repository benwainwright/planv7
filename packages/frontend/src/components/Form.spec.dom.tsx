import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import {
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import Form from "./Form";
import Input from "./form-controls/Input";
import { act } from "react-dom/test-utils";

const editFieldByLabelText = (labelText: string, value: string): void => {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
};

describe("The Form component", () => {
  describe("The Clear button", () => {
    it("Must be invisible if the page is clean before it has been edited", () => {
      act(() => {
        render(
          <Form onSubmit={jest.fn()}>
            <Input name="one" label="Field One" />
            <Input name="two" label="Field Twe" />
            <Input name="three" label="Field Three" />
          </Form>
        );
      });
      expect(screen.queryByText("Clear")).toBeNull();
    });

    it("Must be visible if any fields have been edited", () => {
      act(() => {
        render(
          <Form onSubmit={jest.fn()}>
            <Input label="Field One" name="one" />
            <Input label="Field Two" name="two" />
            <Input label="Field Three" name="three" />
          </Form>
        );

        editFieldByLabelText("Field One", "foo");
      });

      act(() => {
        editFieldByLabelText("Field Three", "bar");
      });

      expect(screen.queryByText("Clear")).not.toBeNull();
    });

    it("Must dissapear if all the fields change to empty", () => {
      act(() => {
        render(
          <Form onSubmit={jest.fn()}>
            <Input
              label="Field One"
              name="one"
            />
            <Input
              label="Field Two"
              name="two"
            />
            <Input
              label="Field Three"
              name="three"
            />
          </Form>
        );

        editFieldByLabelText("Field One", "foo");
      });
      act(() => {
        editFieldByLabelText("Field Two", "bif");
      });
      act(() => {
        editFieldByLabelText("Field Three", "bar");
      });

      act(() => {
        editFieldByLabelText("Field One", "");
      });
      act(() => {
        editFieldByLabelText("Field Two", "");
      });
      act(() => {
        editFieldByLabelText("Field Three", "");
      });

      expect(screen.queryByText("Clear")).toBeNull();
    });

    it("Must set all fields to empty when clicked", () => {
      act(() => {
        render(
          <Form onSubmit={jest.fn()}>
            <Input
              label="Field One"
              name="one"
            />
            <Input
              label="Field Two"
              name="two"
            />
            <Input
              label="Field Three"
              name="three"
            />
          </Form>
        );

        editFieldByLabelText("Field One", "foo");
        editFieldByLabelText("Field Two", "foo");
        editFieldByLabelText("Field Three", "bar");
      });

      act(() => {
        fireEvent.click(screen.getByText("Clear"));
      });

      expect(screen.getByLabelText("Field One")).toHaveValue("");
      expect(screen.getByLabelText("Field Two")).toHaveValue("");
      expect(screen.getByLabelText("Field Three")).toHaveValue("");
    });
  });

  describe("The submit button", () => {
    it("It must call the onSubmit handler with TextField data", () => {
      const onSubmit = jest.fn();

      act(() => {
        render(
          <Form onSubmit={onSubmit}>
            <Input
              label="Field One"
              name="one"
            />
            <Input
              label="Field Two"
              name="two"
            />
            <Input
              label="Field Three"
              name="three"
            />
          </Form>
        );

        editFieldByLabelText("Field One", "foo");
      });

      act(() => {
        editFieldByLabelText("Field Two", "bar");
      });

      act(() => {
        editFieldByLabelText("Field Three", "baz");
      });

      act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });

      expect(onSubmit).toHaveBeenCalledWith({
        data: undefined,
        values: {
          one: "foo",
          two: "bar",
          three: "baz",
        }
      });
    });
  });
});
