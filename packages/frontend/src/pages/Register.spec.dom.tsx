/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import {
  TYPES as DOMAIN,
  LoginCommand,
  RegisterUserCommand,
} from "@choirpractise/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import Register from "./Register";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

const editFieldByLabelText = (labelText: string, value: string): void => {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
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
        render(<Register title="Register" />);
        editFieldByLabelText("Username", "foo");
      });
      act(() => {
        editFieldByLabelText("Password", "bar");
      });
      act(() => {
        editFieldByLabelText("Verify Password", "baz");
      });
      act(() => {
        editFieldByLabelText("Email", "baz@bar.com");
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
        render(<Register title="Register" />);
        editFieldByLabelText("Username", "foo");
      });
      act(() => {
        editFieldByLabelText("Password", "bar");
      });
      act(() => {
        editFieldByLabelText("Verify Password", "baz");
      });
      act(() => {
        editFieldByLabelText("Email", "baz2@bar.com");
      });

      await act(async () => {
        fireEvent.click(screen.getByText("Submit"));
      });

      expect(execute).toHaveBeenCalledWith(new LoginCommand("foo", "bar"));
    });
  });
});
