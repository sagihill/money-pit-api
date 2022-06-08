import { LoggerTypes } from "../../../types";
import { getLogger } from "../../logger";
import { ServicesProvider } from "../services-provider";

export default async function Logger(
  options: any,
  SP: ServicesProvider
): Promise<LoggerTypes.ILogger> {
  const logger = getLogger;
  return logger;
}
