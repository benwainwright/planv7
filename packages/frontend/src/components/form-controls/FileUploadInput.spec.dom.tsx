import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import FileUploadInput from "./FileUploadInput";
import { act } from "react-dom/test-utils";

describe("File upload input", () => {

  it("Displays 'Click to select' when there is no file", () => {
    act(() => {
      render(<FileUploadInput label="foo" name="foo" />);
    });
    expect(screen.getByTitle("foo-button")).toHaveTextContent(

      "Click to select"
    );
  });

  it("Changes the text to the filename when a file has been selected", () => {
    act(() => {
      const file = new File([], "foo.zip");
      render(<FileUploadInput label="foo" name="foo" />);
      fireEvent.change(screen.getByTitle("foo"), { target: { files: [file] } });
    });
    expect(screen.getByTitle("foo-button")).toHaveTextContent("foo.zip");
  });
});
