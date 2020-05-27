import * as constants from "../constants";
import { Db, MongoClient } from "mongodb";
import AppContext from "../AppContext";
import Koa from "koa";
import { Logger } from "@planv7/application";
import { MongoMemoryServer } from "mongodb-memory-server";

const getUrl = async (
  logger: Logger,
  cleanupHandlers: Function[]
): Promise<string> => {
  if (process.env.USE_MONGO_MEMORY_SERVER) {
    logger.info("Using MongoDB memory server");
    const server = new MongoMemoryServer();
    cleanupHandlers.push(async () => server.stop());
    return server.getConnectionString();
  }
  return process.env.MONGO_URL ?? constants.MONGO_URL;
};

const connectToDatabase = async (
  logger: Logger,
  cleanupHandlers: Function[]
): Promise<Db> => {
  const mongoUrl = await getUrl(logger, cleanupHandlers);
  const mongoClient = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  cleanupHandlers.push(async () => mongoClient.close());
  logger.info("Connection successful");
  return mongoClient.db(process.env.MONGO_DB_NAME ?? constants.MONGO_DB_NAME);
};

export default connectToDatabase;
