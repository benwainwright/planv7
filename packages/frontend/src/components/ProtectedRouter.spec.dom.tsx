import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import ProtectedRouter, {
  ProtectedRouterComponentProps,
} from "./ProtectedRouter";
import { render, screen } from "@testing-library/react";
import CurrentUserContext from "../utils/CurrentUserContext";
import { act } from "react-dom/test-utils";
import { navigate } from "@reach/router";

describe("The protected router", () => {
  it("Renders the route when it is public and there is no user", () => {
    const MockPublicComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <MockPublicComponent public path="/" />
            <MockPublicComponent2 public path="/foo" />
            <MockPublicComponent default public path="/baz" />
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });

    expect(screen.queryByText("Foo")).not.toBeNull();
  });

  it("Renders the route when it is public and there is no user and you have navigated to it", async () => {

    const MockPublicComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <MockPublicComponent public path="/" />
            <MockPublicComponent2 public path="/foo" />
            <MockPublicComponent default public path="/baz" />
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Bar")).not.toBeNull();
  });

  it("Renders the default component if the route is NOT public and you try to navigate to it", async () => {
    const RedirectComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Redirected</div>
      </React.Fragment>
    );

    const MockPublicComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterComponentProps> = () => (
      <CurrentUserContext.Provider value={undefined}>
        <React.Fragment>
          <div>Private</div>
        </React.Fragment>
      </CurrentUserContext.Provider>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <MockPublicComponent public path="/" />
            <MockPublicComponent2 path="/foo" />
            <RedirectComponent public default />
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Private")).toBeNull();
    expect(screen.queryByText("Redirected")).not.toBeNull();
  });


  it("Throws an error if there is no default route", async () => {
    const MockPublicComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    jest.spyOn(console, "error");
    /* eslint-disable no-console */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // The  error is caught by the test by it still logs an
    // enormous red stack trace for some reason, so lets
    // hide the stack trace so it doesn't look like a failure
    (console.error as any).mockImplementation(() => {
      // Noop
    })

    await expect(act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <MockPublicComponent public path="/" />
            <MockPublicComponent2 public path="/foo" />
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    })).rejects.toThrow(new Error("ProtectedRouter must contain a 'default' route"));
    (console.error as any).mockRestore();
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable no-console */
  });

  it("Throws an error if the default route is not public", async () => {
    const MockPublicComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    jest.spyOn(console, "error");
    /* eslint-disable no-console */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (console.error as any).mockImplementation(() => {
      // Noop
    })

    await expect(act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <MockPublicComponent public path="/" />
            <MockPublicComponent2 default path="/foo" />
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    })).rejects.toThrow(new Error("'Default' route in a ProtectedRouter must be public"));
    (console.error as any).mockRestore();
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable no-console */
  });
});
