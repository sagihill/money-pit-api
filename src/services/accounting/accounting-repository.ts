import { Model } from "mongoose";
import { MongoRepository } from "../../lib/repository";
import Expense from "../../models/Expense";
import { MongoTypes, AccountingTypes, LoggerTypes } from "../../types";

export const getAccountingRepository = (logger: LoggerTypes.ILogger) => {
  return new AccountingRepository(Expense, logger);
};

export class AccountingRepository extends MongoRepository<
  AccountingTypes.Expense,
  AccountingTypes.Requests.UpdateRequest
> {
  constructor(
    model: Model<AccountingTypes.Expense>,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super(model);
  }

  async addMany(
    data: AccountingTypes.Expense[]
  ): Promise<AccountingTypes.Expense[]> {
    const needInsert = [];

    for await (const expense of data) {
      const res = await this.model.updateOne(
        { id: expense.id, chargeDate: null },
        {
          $set: { ...expense },
        },
        { upsert: false }
      );

      if (res.modifiedCount === 0) {
        needInsert.push(expense);
      }
    }

    if (needInsert.length !== data.length) {
      this.logger.info(`Updated ${data.length - needInsert.length} data`);
    }

    if (needInsert.length) {
      await this.model
        .insertMany(data, { ordered: false })
        .then(() => {
          this.logger.info(`Added ${data.length} expenses`);
        })
        .catch((err) => {
          this.logger.info(`Added ${err.result.result.nInserted} expenses`);
        });
    }

    return needInsert;
  }
}
