import { MongoRepository } from "../../lib/repository";
import Expense from "../../models/Expense";
import { MongoTypes, AccountingTypes, TimeFrame } from "../../types";
import { Model } from "mongoose";

export const getAccountingRepository = () => {
  return new AccountingRepository(Expense);
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
  constructor(model: Model<AccountingTypes.Expense>) {
    super(model);
  }

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    await this.addMany(expenses);
  }

  async getExpenses(
    accountId: string,
    timeFrame: TimeFrame
  ): Promise<AccountingTypes.Expense[]> {
    return this.find({
      accountId,
      createdAt: { $gte: timeFrame.from, $lte: timeFrame.to },
    });
  }
}
