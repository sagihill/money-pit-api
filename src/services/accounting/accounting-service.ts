import { LoggerTypes, AccountingTypes, TimeFrame } from "../../types";
import { createNewExpense } from "./expense-factory";

export class AccountingService implements AccountingTypes.IAccountingService {
  constructor(
    private readonly accountingRepository: AccountingTypes.IAccountingRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async editExpense(
    id: string,
    request: AccountingTypes.EditExpenseRequest
  ): Promise<void> {
    try {
      this.logger.info(`Editing expense`);
      await this.accountingRepository.edit(id, request);
    } catch (error) {
      this.logger.error(`Can't edit expense`);
      throw error;
    }
  }

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    try {
      this.logger.info(`Adding expenses`);
      await this.accountingRepository.addExpenses(expenses);
    } catch (error) {
      this.logger.error(`Can't add expenses`);
      throw error;
    }
  }

  createNewExpense(
    request: AccountingTypes.AddExpenseRequest
  ): AccountingTypes.Expense {
    return createNewExpense(request);
  }

  getAccountSummery(
    accountId: string,
    timeFrame: TimeFrame
  ): Promise<AccountingTypes.AccountSummery> {
    throw new Error("Method not implemented.");
  }
}
