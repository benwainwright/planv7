import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { TYPES as DOMAIN, LoginCommand } from "@choirpractise/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./Login";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

const editFieldByLabelText = (labelText: string, value: string): void => {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
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
        render(<Login icon={jest.fn() as unknown as React.ReactElement}title="Login" />);
        editFieldByLabelText("Username", "foo");
      });
      act(() => {
        editFieldByLabelText("Password", "bar");
      });

      act(() => {
        fireEvent.click(screen.getByText("Submit"));
      });
      expect(execute).toHaveBeenCalledWith(new LoginCommand("foo", "bar"));
    });
  });
});
