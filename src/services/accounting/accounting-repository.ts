import { MongoRepository } from "../../lib/repository";
import Expense from "../../models/Expense";
import {
  MongoTypes,
  AccountingTypes,
  TimeFrame,
  LoggerTypes,
} from "../../types";
import { Model } from "mongoose";

export const getAccountingRepository = (logger: LoggerTypes.ILogger) => {
  return new AccountingRepository(Expense, logger);
};

export class AccountingRepository
  extends MongoRepository<
    AccountingTypes.Expense,
    AccountingTypes.EditExpenseRequest
  >
  implements
    AccountingTypes.IAccountingRepository,
    MongoTypes.Repository<
      AccountingTypes.Expense,
      AccountingTypes.EditExpenseRequest
    >
{
  constructor(
    model: Model<AccountingTypes.Expense>,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super(model);
  }

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    await this.addMany(expenses);
  }

  async addExpensesFromExtract(
    expenses: AccountingTypes.Expense[]
  ): Promise<void> {
    // await this.model
    //   .insertMany(expenses, { ordered: false })
    //   .then(() => {
    //     this.logger.info(`Added ${expenses.length} expenses`);
    //   })
    //   .catch((err) => {
    //     this.logger.info(`Added ${err.result.result.nInserted} expenses`);
    //   });

    for await (const expense of expenses) {
      await this.model.updateOne(
        { id: expense.id, chargeDate: { $exists: false } },
        {
          $set: { ...expense },
        },
        { upsert: true }
      );
    }
  }

  async getExpenses(
    accountId: string,
    timeFrame: TimeFrame
  ): Promise<AccountingTypes.Expense[]> {
    return await this.find({
      accountId,
      timestamp: { $gte: timeFrame.from, $lte: timeFrame.to },
    });
  }
}
