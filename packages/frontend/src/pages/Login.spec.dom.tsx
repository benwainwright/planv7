import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { TYPES as DOMAIN, LoginCommand } from "@planv7/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./Login";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

const editFieldByTestId = (testId: string, value: string): void => {
  fireEvent.change(screen.getByTestId(testId), { target: { value } });
};

describe("Login page", () => {
  describe("Submit button", () => {
    it("Must send a login command to the commandBus", () => {
      const execute = jest.fn();
      const commandBus = { execute };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      when(useDependency as any)
        .calledWith(DOMAIN.commandBus)
        .mockReturnValue(commandBus);

      act(() => {
        render(<Login />);
        editFieldByTestId("username", "foo");
      });
      act(() => {
        editFieldByTestId("password", "bar");
      });

      act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });
      expect(execute).toHaveBeenCalledWith(new LoginCommand("foo", "bar"));
    });
  });
});
