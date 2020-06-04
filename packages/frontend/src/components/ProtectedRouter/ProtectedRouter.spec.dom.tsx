import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { TYPES as DOMAIN, User } from "@choirpractise/domain";
import ProtectedRouter, {
  ProtectedRouterComponentProps,
  ProtectedRouterPageComponentProps,
} from "./ProtectedRouter";
import { render, screen } from "@testing-library/react";
import CurrentUserContext from "../../utils/CurrentUserContext";
import Drawer from "../../components/Drawer";
import Routes from "./Routes";
import { act } from "react-dom/test-utils";
import { navigate } from "@reach/router";
import { useDependency } from "../../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../../utils/inversify-provider");

describe("The protected router", () => {
  it("Renders links to public and onlyPublic routes in the menu when there is no user", () => {
    const execute = jest.fn();
    const commandBus = { execute };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when(useDependency as any)
      .calledWith(DOMAIN.commandBus)
      .mockReturnValue(commandBus);

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>FooElement</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent4: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>OnlyPublic</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Drawer
              mobileOpen={true}
              onClose={(): void => {
                // Noop
              }}
            >
              <div>Placeholder</div>
            </Drawer>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" public path="/foo" />
              <MockPublicComponent4 title="FooBar" onlyPublic path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Home")).not.toBeNull();
    expect(screen.queryByText("Foo")).not.toBeNull();
    expect(screen.queryByText("FooBar")).not.toBeNull();
  });

  it("Doesn't render links to private routes in the menu when there is no user", () => {
    const execute = jest.fn();
    const commandBus = { execute };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when(useDependency as any)
      .calledWith(DOMAIN.commandBus)
      .mockReturnValue(commandBus);
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>FooElement</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Drawer
              mobileOpen={true}
              onClose={(): void => {
                // Noop
              }}
            >
              <div>Placeholder</div>
            </Drawer>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Home")).not.toBeNull();
    expect(screen.queryByText("Foo")).toBeNull();
  });

  it("Doesn't render links to private routes in the menu when there is no user", () => {
    const execute = jest.fn();
    const commandBus = { execute };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when(useDependency as any)
      .calledWith(DOMAIN.commandBus)
      .mockReturnValue(commandBus);

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>FooElement</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Drawer
              mobileOpen={true}
              onClose={(): void => {
                // Noop
              }}
            >
              <div>Placeholder</div>
            </Drawer>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Home")).not.toBeNull();
    expect(screen.queryByText("Foo")).toBeNull();
  });

  it("Doesn't render links to onlyPublic routes in the menu when there is a user", () => {
    const execute = jest.fn();
    const commandBus = { execute };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when(useDependency as any)
      .calledWith(DOMAIN.commandBus)
      .mockReturnValue(commandBus);
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>FooElement</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={(jest.fn() as unknown) as User}>
          <ProtectedRouter>

            <Drawer
              mobileOpen={true}
              onClose={(): void => {
                // Noop
              }}
            >
              <div>Placeholder</div>
            </Drawer>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" onlyPublic path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });
    expect(screen.queryByText("Home")).not.toBeNull();
    expect(screen.queryByText("Foo")).toBeNull();
  });

  it("Renders the route when it is public and there is no user", () => {
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    act(() => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" public path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
    });

    expect(screen.queryByText("Foo")).not.toBeNull();
  });

  it("Renders the route when it is public and there is no user and you have navigated to it", async () => {
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    const MockPublicComponent3: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" public path="/foo" />
              <MockPublicComponent3 default public path="/baz" />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Bar")).not.toBeNull();
  });

  it("Renders the default component if the route is NOT public, there is no user and you try to navigate to it", async () => {
    const RedirectComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Redirected</div>
      </React.Fragment>
    );

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
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
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" path="/foo" />
              <RedirectComponent public default />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Private")).toBeNull();
    expect(screen.queryByText("Redirected")).not.toBeNull();
  });

  it("Renders the component if the route is NOT public, there is a user and you try to navigate to it", async () => {
    const RedirectComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Redirected</div>
      </React.Fragment>
    );

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <CurrentUserContext.Provider value={undefined}>
        <React.Fragment>
          <div>Private</div>
        </React.Fragment>
      </CurrentUserContext.Provider>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={(jest.fn() as unknown) as User}>
          <ProtectedRouter>
            <Routes>
              <MockPublicComponent public title="Home" path="/" />
              <MockPublicComponent2 title="Foo" path="/foo" />
              <RedirectComponent public default />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Private")).not.toBeNull();
    expect(screen.queryByText("Redirected")).toBeNull();
  });

  it("Renders the default component if the route is onlyPublic, there IS a user and you try to navigate to it", async () => {
    const RedirectComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Redirected</div>
      </React.Fragment>
    );

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Private</div>
      </React.Fragment>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={(jest.fn() as unknown) as User}>
          <ProtectedRouter>
            <Routes>
              <MockPublicComponent title="Home" public path="/" />
              <MockPublicComponent2 title="Foo" onlyPublic path="/foo" />
              <RedirectComponent public default />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Private")).toBeNull();
    expect(screen.queryByText("Redirected")).not.toBeNull();
  });

  it("Renders the component if the route is onlyPublic, there is no user and you try to navigate to it", async () => {
    const RedirectComponent: React.FC<ProtectedRouterComponentProps> = () => (
      <React.Fragment>
        <div>Redirected</div>
      </React.Fragment>
    );

    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Private</div>
      </React.Fragment>
    );

    await act(async () => {
      render(
        <CurrentUserContext.Provider value={undefined}>
          <ProtectedRouter>
            <Routes>
              <MockPublicComponent public title="Home" path="/" />
              <MockPublicComponent2 title="Foo" onlyPublic path="/foo" />
              <RedirectComponent public default />
            </Routes>
          </ProtectedRouter>
        </CurrentUserContext.Provider>
      );
      await navigate("/foo");
    });

    expect(screen.queryByText("Private")).not.toBeNull();
    expect(screen.queryByText("Redirected")).toBeNull();
  });

  it("Throws an error if there is no default route", async () => {
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
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
    });

    await expect(
      act(async () => {
        render(
          <CurrentUserContext.Provider value={undefined}>
            <ProtectedRouter>
              <Routes>
                <MockPublicComponent public title="Home" path="/" />
                <MockPublicComponent2 public title="Foo" path="/foo" />
              </Routes>
            </ProtectedRouter>
          </CurrentUserContext.Provider>
        );
      })
    ).rejects.toThrow(
      new Error("ProtectedRouter must contain a 'default' route")
    );
    (console.error as any).mockRestore();
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable no-console */
  });

  it("Throws an error if the default route is not public", async () => {
    const MockPublicComponent: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Foo</div>
      </React.Fragment>
    );

    const MockPublicComponent2: React.FC<ProtectedRouterPageComponentProps> = () => (
      <React.Fragment>
        <div>Bar</div>
      </React.Fragment>
    );

    jest.spyOn(console, "error");
    /* eslint-disable no-console */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (console.error as any).mockImplementation(() => {
      // Noop
    });

    await expect(
      act(async () => {
        render(
          <CurrentUserContext.Provider value={undefined}>
            <ProtectedRouter>
              <Routes>
                <MockPublicComponent title="Home" public path="/" />
                <MockPublicComponent2 title="Foo" default path="/foo" />
              </Routes>
            </ProtectedRouter>
          </CurrentUserContext.Provider>
        );
      })
    ).rejects.toThrow(
      new Error("'Default' route in a ProtectedRouter must be public")
    );
    (console.error as any).mockRestore();
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable no-console */
  });
});
