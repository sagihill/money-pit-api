import { TechTypes, LoggerTypes } from "../../types";
import { Migrations } from "./migrations";

export class MigrationService implements TechTypes.IMigrationService {
  constructor(
    protected readonly repo: TechTypes.IMigrationRepository,
    protected readonly options: TechTypes.MigrationServiceOptions,
    protected readonly logger: LoggerTypes.ILogger
  ) {}

  async migrate(): Promise<void> {
    for await (const [key, migration] of Object.entries<any>(Migrations)) {
      const splited = key.split("_");
      const name = splited[0];
      const id = key.split("_").slice(1).join("-");
      const isMigrated = await this.repo.isMigrated(id);
      if (!isMigrated) {
        this.logger.info(`Migrating ${name} migration.`);
        await migration.default();
        await this.repo.save({ id, name, migratedAt: new Date() });
      }
    }
  }
}
