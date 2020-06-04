import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { TYPES as DOMAIN, LogoutCommand } from "@choirpractise/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import CurrentUserContext from "../utils/CurrentUserContext";
import Header from "./Header";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

const asMocked = <T extends unknown>(
  input: (() => T) | (new () => T)
): jest.Mocked<T> => {
  return (input as unknown) as jest.Mocked<T>;
};

describe("The header", () => {
  it("Shows the logout link if there is a user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={asMocked(jest.fn())}>
          <Header
            onExpandHeaderClick={(): void => {
              // Noop
            }}
            title="Foobar"
          >
            <div>Placeholder</div>
          </Header>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Logout")).not.toBeNull();
  });

  it("Does not show the logout link if there is no user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <Header
            onExpandHeaderClick={(): void => {
              // Noop
            }}
            title="Foobar"
          >
            <div>Placeholder</div>
          </Header>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Logout")).toBeNull();
  });

  describe("The logout link", () => {
    it("Sends a logout command to the command bus", () => {
      const execute = jest.fn();
      const commandBus = { execute };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      when(useDependency as any)
        .calledWith(DOMAIN.commandBus)
        .mockReturnValue(commandBus);

      act(() => {
        render(
          <CurrentUserContext.Provider value={asMocked(jest.fn())}>
            <Header
              onExpandHeaderClick={(): void => {
                // Noop
              }}
              title="Foobar"
            >
              <div>Placeholder</div>
            </Header>
          </CurrentUserContext.Provider>
        );
        fireEvent.click(screen.getByText("Logout"));
      });

      expect(execute).toHaveBeenCalledWith(new LogoutCommand());
    });
  });
});
