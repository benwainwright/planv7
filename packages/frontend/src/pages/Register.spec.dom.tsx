/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import {
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@planv7/domain";
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
      });
      act(() => {
        editFieldByTestId("password", "bar");
      });
      act(() => {
        editFieldByTestId("verifyPassword", "baz");
      });
      act(() => {
        editFieldByTestId("email", "baz@bar.com");
      });

      act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });
      expect(execute).toHaveBeenCalledWith(
        new RegisterUserCommand("foo", "baz@bar.com", "bar")
      );
    });

    it("Must send a login command to the commandbus", async () => {
      const execute = jest.fn();
      const commandBus = { execute };

      when(useDependency as any)
        .calledWith(DOMAIN.commandBus)
        .mockReturnValue(commandBus);

      act(() => {
        render(<Register />);
        editFieldByTestId("username", "foo");
      });
      act(() => {
        editFieldByTestId("password", "bar");
      });
      act(() => {
        editFieldByTestId("verifyPassword", "baz");
      });
      act(() => {
        editFieldByTestId("email", "baz2@bar.com");
      });

      await act(async () => {
        fireEvent.click(screen.getByText("Submit"));
      });

      expect(execute).toHaveBeenCalledWith(new LoginCommand("foo", "bar"));
    });
  });
});
