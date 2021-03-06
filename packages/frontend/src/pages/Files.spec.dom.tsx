/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import * as React from "react";
import { TYPES as DOMAIN, UploadFileCommand } from "@choirpractise/domain";
import { fireEvent, render, screen } from "@testing-library/react";
import Files from "../pages/Files";
import { act } from "react-dom/test-utils";
import { useDependency } from "../utils/inversify-provider";
import { when } from "jest-when";

jest.mock("../utils/inversify-provider");

describe("The files page", () => {
  it("Sends a fileupload command when you select a file and press upload", () => {
    const execute = jest.fn();
    const commandBus = { execute };

    when(useDependency as any)
      .calledWith(DOMAIN.commandBus)
      .mockReturnValue(commandBus);

    const file = new File([], "foo.zip");
    act(() => {
      render(<Files icon={jest.fn() as unknown as React.ReactElement} title="Files" />);
      fireEvent.change(screen.getByLabelText("File Upload"), {
        target: { files: [file] },
      });
    });
    act(() => {
      fireEvent.change(screen.getByLabelText("Path"), {
        target: { value: "foo/bar" },
      });
    });

    act(() => {
      fireEvent.click(screen.getByText("Upload"));
    })

    expect(execute).toHaveBeenCalledWith(
      new UploadFileCommand(file, "foo/bar")
    );
  });
});
