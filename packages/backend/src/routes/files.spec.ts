import * as AWS from "aws-sdk";
import Koa from "koa";
import bodyParser from "koa-bodyparser"
import files from "./files";
import request from "supertest";

jest.mock("aws-sdk");

const asMock = <T>(thing: T): jest.Mock<T> => {
  return (thing as unknown) as jest.Mock<T>;
};

describe("The files endpoint", () => {
  it("Requests a presigned url to allow you to upload a file given a POST request supplying a given object", async () => {
    process.env.FILES_BUCKET = "fooBucket";
    const app = new Koa();
    app.use(bodyParser());
    const mockS3 = new AWS.S3();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asMock(AWS.S3).mockReturnValue(mockS3 as any);
    mockS3.getSignedUrlPromise = jest.fn();

    app.use(await files());
    const server = app.listen();
    await request(server).post("/files").send({ path: "foo/bar/baz.zip" });

    expect(mockS3.getSignedUrlPromise).toHaveBeenCalledWith("putObject", {
      Bucket: "fooBucket",
      Key: "foo/bar/baz.zip",
    });

    server.close();
    delete process.env.FILES_BUCKET;
  });

  test.todo("Does not call AWS unless the payload is correct");
  test.todo("Returns the url returned by AWS api");
  test.todo("It rejects unauthorised requests");
  test.todo("It tags the upload with the current user");
});
