import * as constants from "../constants";
import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

const getUrl = async (): Promise<string> => {
  if (process.env.USE_MONGO_MEMORY_SERVER) {
    const server = new MongoMemoryServer();
    return server.getConnectionString();
  }
  return process.env.MONGO_URL || constants.MONGO_URL;
};

const connectToDatabase = async (): Promise<Db> => {
  const mongoUrl = await getUrl();
  const mongoClient = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return mongoClient.db(process.env.MONGO_DB_NAME || constants.MONGO_DB_NAME);
};

export default connectToDatabase;
