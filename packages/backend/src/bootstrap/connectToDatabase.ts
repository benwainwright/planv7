import * as constants from "../constants";
import { Db, MongoClient } from "mongodb";
import { Logger } from "@planv7/application";
import { MongoMemoryServer } from "mongodb-memory-server";

const getUrl = async (logger: Logger): Promise<string> => {
  if (process.env.USE_MONGO_MEMORY_SERVER) {
    logger.info("Using MongoDB memory server");
    const server = new MongoMemoryServer();
    return server.getConnectionString();
  }
  return process.env.MONGO_URL ?? constants.MONGO_URL;
};

const connectToDatabase = async (logger: Logger): Promise<Db> => {
  const mongoUrl = await getUrl(logger);
  const mongoClient = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  throw new Error("Foo");
  logger.info("Connection successful");
  return mongoClient.db(process.env.MONGO_DB_NAME ?? constants.MONGO_DB_NAME);
};

export default connectToDatabase;
