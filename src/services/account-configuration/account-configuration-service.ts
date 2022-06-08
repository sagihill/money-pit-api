import moment from "moment";
import { ID } from "../../lib";
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
    private readonly cryptr: typeof Cryptr,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async getAccountConfiguration(
    accountId: string
  ): Promise<AccountConfigurationTypes.AccountConfiguration | undefined> {
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

    let totalIncome = 0;

    if (incomes?.length) {
      incomes.forEach((income) => {
        totalIncome = totalIncome + income.amount;
        if (!income.id) {
          income.id = ID.get();
        }
      });
    }

    if (creditAccounts?.length) {
      creditAccounts.forEach((account) => {
        this.encryptCreditAccounts(account);
        if (!account.id) {
          account.id = ID.get();
        }
      });
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

  async findConfigurations(
    request: AccountConfigurationTypes.Requests.FindConfigurationRequest
  ): Promise<AccountConfigurationTypes.AccountConfiguration[] | undefined> {
    try {
      this.logger.info(`Finding configurations : ${{ request }}`);
      return await this.repository.findConfigurations(request);
    } catch (error) {
      this.logger.error(`Can't Finding configurations: ${{ request, error }}`);
      throw error;
    }
  }

  private encryptCreditAccounts(
    creditAccount: AccountConfigurationTypes.CreditAccount
  ): void {
    const password = this.cryptr.encrypt(creditAccount.credentials.password, 8);
    creditAccount.credentials.password = password;

    const username = this.cryptr.encrypt(creditAccount.credentials.username, 8);
    creditAccount.credentials.username = username;
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
