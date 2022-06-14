import { Model } from "mongoose";
import { MongoRepository } from "../../lib/repository";
import Expense from "../../models/Expense";
import { MongoTypes, AccountingTypes, LoggerTypes } from "../../types";

export const getAccountingRepository = (logger: LoggerTypes.ILogger) => {
  return new AccountingRepository(Expense, logger);
};

export class AccountingRepository
  extends MongoRepository<
    AccountingTypes.Expense,
    AccountingTypes.Requests.UpdateRequest
  >
  implements
    AccountingTypes.IAccountingRepository,
    MongoTypes.Repository<
      AccountingTypes.Expense,
      AccountingTypes.Requests.UpdateRequest
    >
{
  constructor(
    model: Model<AccountingTypes.Expense>,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super(model);
  }

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    const needInsert = [];

    for await (const expense of expenses) {
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

    if (needInsert.length !== expenses.length) {
      this.logger.info(
        `Updated ${expenses.length - needInsert.length} expenses`
      );
    }

    if (needInsert.length) {
      await this.model
        .insertMany(expenses, { ordered: false })
        .then(() => {
          this.logger.info(`Added ${expenses.length} expenses`);
        })
        .catch((err) => {
          this.logger.info(`Added ${err.result.result.nInserted} expenses`);
        });
    }
  }
}
