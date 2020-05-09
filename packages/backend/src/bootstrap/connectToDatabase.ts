import * as constants from "../constants";
import { Db, MongoClient } from "mongodb";

const connectToDatabase = async (): Promise<Db> => {
  const mongoUrl = process.env.MONGO_URL || constants.MONGO_URL;

  const mongoClient = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return mongoClient.db(process.env.MONGO_DB_NAME || constants.MONGO_DB_NAME);
};

export default connectToDatabase;