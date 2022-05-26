import {
  LoggerTypes,
  AccountingTypes,
  TimeFrame,
  AccountTypes,
} from "../../types";
import { createNewExpense } from "./expense-factory";

export class AccountingService implements AccountingTypes.IAccountingService {
  constructor(
    private readonly accountService: AccountTypes.IAccountService,
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

  async addExpensesFromExtract(
    expenses: AccountingTypes.Expense[]
  ): Promise<void> {
    try {
      this.logger.info(`Adding expenses`);
      await this.accountingRepository.addExpensesFromExtract(expenses);
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

  async getAccountSummery(
    accountId: string,
    timeFrame: TimeFrame
  ): Promise<AccountingTypes.AccountSummery> {
    try {
      console.log(timeFrame);
      const account = await this.accountService.get(accountId);

      if (!account) {
        throw new Error(`account_${accountId} doesn't exits.`);
      }

      const expenses = await this.accountingRepository.getExpenses(
        accountId,
        timeFrame
      );

      if (!expenses.length) {
        throw new Error("No expenses in this time frame");
      }

      console.log(expenses);

      const incomeAmount = account.configuration.incomes.reduce(
        (acc, income) => acc + income.amount,
        0
      );

      const expenseAmount = expenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );

      const totalBudget =
        account.configuration.budget?.totalBudget ?? incomeAmount;

      const accountSummery: AccountingTypes.AccountSummery = {
        incomeAmount,
        totalBudget,
        expenseAmount,
        balance: totalBudget - expenseAmount,
        categoriesSummery: this.getCategoriesSummery(
          expenses,
          account.configuration
        ),
      };

      return accountSummery;
    } catch (error: any) {
      this.logger.error(`Can't get account summery: ${error?.message}`);
      throw error;
    }
  }

  private getCategoriesSummery(
    expenses: AccountingTypes.Expense[],
    accountConfig: AccountTypes.AccountConfiguration
  ): AccountingTypes.CategoriesSummery {
    const summery: AccountingTypes.CategoriesSummery = {};
    expenses.forEach((expense) => {
      if (!summery[expense.category]) {
        const budget = accountConfig?.budget?.categoriesBudget
          ? accountConfig?.budget?.categoriesBudget[expense.category]
          : undefined;
        summery[expense.category] = {
          budget,
          expenseAmount: expense.amount,
          balance: budget ? budget - expense.amount : undefined,
        };
      } else {
        const currentSummery = summery[expense.category];
        summery[expense.category] = {
          budget: currentSummery.budget ?? undefined,
          expenseAmount: currentSummery.expenseAmount + expense.amount,
          balance: currentSummery.balance
            ? currentSummery.balance - expense.amount
            : undefined,
        };
      }
    });

    return summery;
  }
}
