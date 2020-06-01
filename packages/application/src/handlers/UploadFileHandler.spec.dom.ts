import { FileStore } from "@choirpractise/application";
import { UploadFileCommand } from "@choirpractise/domain";
import UploadFileHandler from "./UploadFileHandler";

describe("The upload file handler", () => {
  it("Saves the file using the file store", async () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = jest.fn() as unknown as FileStore;
    store.saveFile = jest.fn();
    const handler = new UploadFileHandler(store);

    const file = new File([], "foo.zip");

    const command = new UploadFileCommand(file, "foo/bar");
    await handler.tryHandle(command)

    expect(store.saveFile).toHaveBeenCalledWith(file, "foo/bar");
  });
});
