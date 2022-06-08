import { ConfigTypes } from "../../../types";
import { getConfigRepository } from "../../config/config-repository";
import { ConfigService } from "../../config/config-service";
import { ServicesProvider } from "../services-provider";

export default async function Config(
  options: any,
  SP: ServicesProvider
): Promise<ConfigTypes.IConfigService> {
  const logger = await SP.Logger();
  const repository = getConfigRepository();
  const config = new ConfigService(repository, logger);
  return config;
}
