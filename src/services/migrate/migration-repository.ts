import { TechTypes } from "../../types";
import { Model } from "mongoose";
import Migration from "../../models/Migration";

export const getMigrationRepository = () => {
  return new MigrationRepository(Migration);
};

export class MigrationRepository implements TechTypes.IMigrationRepository {
  constructor(protected readonly migrate: Model<TechTypes.Migration>) {}

  async save(migration: TechTypes.Migration): Promise<void> {
    const modelInstance = new this.migrate(migration);
    const doc = await modelInstance.save();
  }

  async isMigrated(id: string): Promise<boolean> {
    const doc = await this.migrate.findOne({ id });
    return !!doc;
  }
}
