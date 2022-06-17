import * as path from "path";
import { TechTypes } from "../../../types";
import { getMigrationRepository } from "../../migrate";
import { MigrationService } from "../../migrate";
import { ServicesProvider } from "../services-provider";

export default async function Migrate(
  options: any,
  SP: ServicesProvider
): Promise<TechTypes.IMigrationService> {
  const logger = await SP.Logger();
  const repo = getMigrationRepository();

  const configuration: TechTypes.MigrationServiceOptions = {};
  const mongo = new MigrationService(repo, configuration, logger);
  return mongo;
}
