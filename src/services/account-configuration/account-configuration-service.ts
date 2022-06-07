import moment from "moment";
import {
  LoggerTypes,
  AccountTypes,
  AccountConfigurationTypes,
  RecurrentExpenseTypes,
} from "../../types";
const Cryptr = require("cryptr");

export class AccountConfigurationService
  implements AccountConfigurationTypes.IAccountConfigurationService
{
  constructor(
    private readonly repository: AccountConfigurationTypes.IAccountConfigurationRepository,
    private readonly recurrentExpense: RecurrentExpenseTypes.IReccurentExpensesService,
    private readonly accountService: AccountTypes.IAccountService,
    private readonly cryptr: typeof Cryptr,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async getAccountConfiguration(
    accountId: string
  ): Promise<AccountConfigurationTypes.AccountConfiguration | undefined> {
    await this.validateAccount(accountId);

    const recurrentExpenses =
      await this.recurrentExpense.getRecurrentExpensesByAccount(accountId);
    const config = (await this.repository.find({ accountId }))[0];
    const { creditAccounts } = config;

    if (creditAccounts) {
      this.decryptCreditAccounts(creditAccounts);
    }

    return {
      ...config,
      recurrentExpenses,
      creditAccounts,
    };
  }

  async update(
    accountId: string,
    request: AccountConfigurationTypes.Requests.UpdateConfigurationRequest
  ): Promise<void> {
    await this.validateAccount(accountId);
    const { recurrentExpenses, creditAccounts, budget, incomes } = request;

    if (recurrentExpenses?.length) {
      const toAdd = [];
      for await (const recurrentExpense of recurrentExpenses) {
        if (!!recurrentExpense.id) {
          toAdd.push(recurrentExpense);
        } else {
          await this.recurrentExpense.updateRecurrentExpense(recurrentExpense);
        }
      }

      if (toAdd.length) {
        await this.recurrentExpense.addRecurrentExpenses(toAdd);
      }
    }

    const totalIncome = (incomes || []).reduce(
      (acc: number, income: { amount: number }) => acc + income.amount,
      0
    );

    if (creditAccounts) {
      this.encryptCreditAccounts(creditAccounts);
    }

    await this.repository.update(accountId, {
      creditAccounts,
      budget: {
        ...request.budget,
        totalBudget: request.budget?.totalBudget ?? totalIncome,
      },
      incomes,
    });
  }

  private async validateAccount(accountId: string): Promise<void> {
    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new Error(
        `Can't update account_${accountId} configuration, account doesn't exist.`
      );
    }
  }

  private encryptCreditAccounts(
    creditAccounts: AccountConfigurationTypes.CreditAccount[]
  ): void {
    creditAccounts.forEach((account) => {
      const password = this.cryptr.encrypt(account.credentials.password, 8);
      account.credentials.password = password;

      const username = this.cryptr.encrypt(account.credentials.username, 8);
      account.credentials.username = username;
    });
  }

  private decryptCreditAccounts(
    creditAccounts: AccountConfigurationTypes.CreditAccount[]
  ): void {
    creditAccounts.forEach((account) => {
      const password = this.cryptr.decrypt(account.credentials.password, 8);
      account.credentials.password = password;

      const username = this.cryptr.decrypt(account.credentials.username, 8);
      account.credentials.username = username;
    });
  }
}
