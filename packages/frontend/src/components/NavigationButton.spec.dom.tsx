import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NavigationButton from "./NavigationButton";
import { act } from "react-dom/test-utils";
import { navigate } from "@reach/router";

jest.mock("@reach/router");

describe("The navigation button", () => {
  it("Calls navigate when clicked", () => {
    act(() => {
      render(<NavigationButton to="foo">Foo</NavigationButton>);
      fireEvent.click(screen.getByText("Foo"));
    });

    expect(navigate).toBeCalledWith("foo")
  });
});
