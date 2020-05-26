/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { RegisterUserCommand, TYPES as DOMAIN } from "@planv7/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import Register from "./Register";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

const editFieldByTestId = (testId: string, value: string): void => {
  fireEvent.change(screen.getByTestId(testId), { target: { value } });
};

describe("Register page", () => {
  describe("Submit button", () => {
    it("Must send a register command to the commandbus", () => {
      const execute = jest.fn();
      const commandBus = { execute };

      when(useDependency as any)
        .calledWith(DOMAIN.commandBus)
        .mockReturnValue(commandBus);

      act(() => {
        render(<Register />);
        editFieldByTestId("username", "foo");
        editFieldByTestId("password", "bar");
        editFieldByTestId("verifyPassword", "baz");
        editFieldByTestId("email", "baz@bar.com");
      });

      act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });
      expect(execute).toHaveBeenCalledWith(
        new RegisterUserCommand("foo", "baz@bar.com", "bar")
      );
    });
  });

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

    it("Must dissapear if all fields change to empty", async () => {
      await act(async () => {
        render(<Register />);
        const changeValue = {
          target: {
            value: "foobar",
          },
        };

        fireEvent.change(screen.getByTestId("username"), changeValue);
        fireEvent.change(screen.getByTestId("password"), changeValue);
        fireEvent.change(screen.getByTestId("verifyPassword"), changeValue);
      });
      await act(async () => {
        const clearValue = {
          target: {
            value: "",
          },
        };

        fireEvent.change(screen.getByTestId("username"), clearValue);
        fireEvent.change(screen.getByTestId("password"), clearValue);
        fireEvent.change(screen.getByTestId("verifyPassword"), clearValue);
      });

      expect(screen.queryByText("Clear")).toBeNull();
    });

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
