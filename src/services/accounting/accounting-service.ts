import { LoggerTypes, AccountingTypes, TimeFrame } from "../../types";

export class AccountingService implements AccountingTypes.IAccountingService {
  constructor(
    private readonly accountingRepository: AccountingTypes.IAccountingRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    try {
      this.logger.info(`Adding expenses`);
      await this.accountingRepository.addExpenses(expenses);
    } catch (error) {
      this.logger.error(`Can't add expenses`);
      throw error;
    }
  }

  getAccountSummery(
    accountId: string,
    timeFrame: TimeFrame
  ): Promise<AccountingTypes.AccountSummery> {
    throw new Error("Method not implemented.");
  }
}
