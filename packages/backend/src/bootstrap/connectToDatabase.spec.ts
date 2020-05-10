import * as constants from "../constants";
import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "./connectToDatabase";
import { mock as mockExtended } from "jest-mock-extended";

const asMock = <T>(input: (() => T) | (new () => T)): jest.Mock<T> => {
  return (input as unknown) as jest.Mock<T>;
};

jest.mock("mongodb-memory-server");
jest.mock("mongodb");

describe("Connect to database", () => {
  beforeEach(() => {
    delete process.env.USE_MONGO_MEMORY_SERVER;
    delete process.env.MONGO_URL;
    delete process.env.MONGO_DB_NAME;
  });

  it("Connects using the mongo memory server connection string if the environment variable is set", async (): Promise<
    void
  > => {
    process.env.USE_MONGO_MEMORY_SERVER = "YES";

    const mockMongoMemoryServerConstructor = asMock(MongoMemoryServer);
    const mockMongoMemoryServer = mockExtended<MongoMemoryServer>();

    mockMongoMemoryServer.getConnectionString.mockResolvedValue("foobar");
    mockMongoMemoryServerConstructor.mockReturnValue(mockMongoMemoryServer);

    const mockConnect = jest.fn();
    mockConnect.mockResolvedValue(mockExtended<MongoClient>());
    MongoClient.connect = mockConnect;

    await connectToDatabase();

    expect(mockConnect).toHaveBeenCalledWith("foobar", expect.anything());
  });

  it("Returns the mongo url in the environment if set", async (): Promise<
    void
  > => {
    process.env.MONGO_URL = "foobar2";
    const mockConnect = jest.fn();
    mockConnect.mockResolvedValue(mockExtended<MongoClient>());
    MongoClient.connect = mockConnect;

    await connectToDatabase();

    expect(mockConnect).toHaveBeenCalledWith("foobar2", expect.anything());
  });

  it("Returns default mongo url if environment variable not set", async (): Promise<
    void
  > => {
    const mockConnect = jest.fn();
    mockConnect.mockResolvedValue(mockExtended<MongoClient>());
    MongoClient.connect = mockConnect;

    await connectToDatabase();

    expect(mockConnect).toHaveBeenCalledWith(
      constants.MONGO_URL,
      expect.anything()
    );
  });

  it("Uses the DB name in environment if set", async (): Promise<void> => {
    process.env.MONGO_DB_NAME = "foobar";

    const mockConnect = jest.fn();
    const mockClient = mockExtended<MongoClient>();
    mockConnect.mockResolvedValue(mockClient);
    MongoClient.connect = mockConnect;

    await connectToDatabase();

    expect(mockClient.db).toHaveBeenCalledWith("foobar");
  });

  it("Uses the default DB name if not set", async (): Promise<void> => {
    const mockConnect = jest.fn();
    const mockClient = mockExtended<MongoClient>();
    mockConnect.mockResolvedValue(mockClient);
    MongoClient.connect = mockConnect;

    await connectToDatabase();

    expect(mockClient.db).toHaveBeenCalledWith(constants.MONGO_DB_NAME);
  });
});
