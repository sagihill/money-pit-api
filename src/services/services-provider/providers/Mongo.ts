import { MongoTypes } from "../../../types";
import { Mongo as MongoProvider } from "../../mongo";
import { ServicesProvider } from "../services-provider";

export default async function Mongo(
  options: any,
  SP: ServicesProvider
): Promise<MongoTypes.IMongo> {
  const logger = await SP.Logger();
  const mongo = new MongoProvider(logger, process.env.MONGO_URL ?? "");
  return mongo;
}
