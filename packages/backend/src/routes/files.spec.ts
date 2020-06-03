import { Logger } from '@choirpractise/application';
import * as AWS from "aws-sdk";
import * as constants from "../constants";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
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

    app.use(files(jest.fn() as unknown as Logger));
    const server = app.listen();
    await request(server).post("/files").send({ path: "foo/bar/baz.zip", contentType: "text/plain" });

    expect(mockS3.getSignedUrlPromise).toHaveBeenCalledWith("putObject", {
      Bucket: "fooBucket",
      Key: "foo/bar/baz.zip",
      Expires: constants.PRESIGNED_URL_EXPIRY,
      ContentType: "text/plain"
    });

    server.close();
    delete process.env.FILES_BUCKET;
  });

  it("Returns a 400 if the contentType property is missing", async () => {
    process.env.FILES_BUCKET = "fooBucket";
    const app = new Koa();
    app.use(bodyParser());
    const mockS3 = new AWS.S3();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asMock(AWS.S3).mockReturnValue(mockS3 as any);
    mockS3.getSignedUrlPromise = jest.fn();

    app.use(files(jest.fn() as unknown as Logger));
    const server = app.listen();
    const response = await request(server).post("/files").send({path: "foo"});
    expect(response.status).toEqual(400);
    server.close();
    delete process.env.FILES_BUCKET;
  });

  it("Returns a 400 if the path property is missing", async () => {
    process.env.FILES_BUCKET = "fooBucket";
    const app = new Koa();
    app.use(bodyParser());
    const mockS3 = new AWS.S3();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asMock(AWS.S3).mockReturnValue(mockS3 as any);
    mockS3.getSignedUrlPromise = jest.fn();

    app.use(files(jest.fn() as unknown as Logger));
    const server = app.listen();
    const response = await request(server).post("/files").send({contentType: "text/plain"});
    expect(response.status).toEqual(400);
    server.close();
    delete process.env.FILES_BUCKET;
  });

  it("Returns a 200 with the url returned by AWS api", async () => {
    process.env.FILES_BUCKET = "fooBucket";
    const app = new Koa();
    app.use(bodyParser());
    const mockS3 = new AWS.S3();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asMock(AWS.S3).mockReturnValue(mockS3 as any);
    mockS3.getSignedUrlPromise = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mockS3.getSignedUrlPromise as any).mockResolvedValue("fooUrl");

    app.use(files(jest.fn() as unknown as Logger));
    const server = app.listen();
    const response = await request(server)
      .post("/files")
      .send({ path: "foo.zip", contentType: "text/plain" });
    expect(response.status).toEqual(200);

    const body = JSON.parse(response.text);
    expect(body.url).toEqual("fooUrl");
    server.close();
    delete process.env.FILES_BUCKET;
  });

  test.todo("It rejects unauthorised requests");
  test.todo("It tags the upload with the current user");
});
