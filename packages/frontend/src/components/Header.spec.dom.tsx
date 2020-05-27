import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import CurrentUserContext from "../utils/CurrentUserContext";
import Header from "./Header";
import { act } from "react-dom/test-utils";

const asMocked = <T extends unknown>(
  input: (() => T) | (new () => T)
): jest.Mocked<T> => {
  return (input as unknown) as jest.Mocked<T>;
};

describe("The header", () => {
  it("Shows the login and register links if there is no user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <Header />
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Register")).not.toBeNull();
    expect(screen.queryByText("Login")).not.toBeNull();
  });

  it("Does not show the login and register link if there is a user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={asMocked(jest.fn())}>
          <Header />
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Register")).toBeNull();
    expect(screen.queryByText("Login")).toBeNull();
  });

  it("Shows the logout link if there is a user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={asMocked(jest.fn())}>
          <Header />
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Logout")).not.toBeNull();
  });

  it("Does not show the logout link if there is no user", () => {
    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <Header />
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Logout")).toBeNull();
  });
});
