import S3FileStore from "./S3FileStore";
import axios from "axios";
import { when } from "jest-when";

jest.mock("axios");

describe("S3FileStore", () => {
  it("Attempts to upload a file to the URL provided by the files endpoint", async () => {
    const endpoint = "http://localhost";

    const file = new File([], "foo.zip");
    const formData = new FormData();
    formData.append("file", file);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    when(axios as any).calledWith({
      method: "POST",
      url: `${endpoint}/files`,
      data: { path: "foo/bar" },
    }).mockImplementation(async () => Promise.resolve({data: '{"url": "http://foo/bar"}'}))

    const store = new S3FileStore(`${endpoint}/files`);
    await store.saveFile(file, "foo/bar");

    expect(axios).toHaveBeenCalledWith({
      method: "POST",
      url: "http://foo/bar",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  });

  test.todo("Emits an event when its done uploading");

  test.todo("Emits progress events during upload");

  test.todo("Emits an error event if there is a problem");
});
