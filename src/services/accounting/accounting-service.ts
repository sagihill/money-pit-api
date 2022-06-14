import moment from "moment";
import { CriticalError } from "../../errors/service-error";
import {
  LoggerTypes,
  AccountingTypes,
  AccountTypes,
  ChargeMonth,
  AccountConfigurationTypes,
  SalaryTypes,
} from "../../types";
import { createNewExpense } from "./expense-factory";

export class AccountingService implements AccountingTypes.IAccountingService {
  constructor(
    private readonly accountService: AccountTypes.IAccountReaderService,
    private readonly accountingRepository: AccountingTypes.IAccountingRepository,
    private readonly accountConfigurationService: AccountConfigurationTypes.IAccountConfigurationService,
    private readonly salaryService: SalaryTypes.ISalaryService,
    private readonly config: AccountingTypes.AccountingServiceConfiguration,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async editExpense(
    id: string,
    request: AccountingTypes.EditExpenseRequest
  ): Promise<void> {
    try {
      this.logger.info("Editing expense");
      await this.accountingRepository.update(id, request);
    } catch (error: any) {
      this.logger.error("Can't edit expense");
      throw error;
    }
  }

  async addExpenses(expenses: AccountingTypes.Expense[]): Promise<void> {
    try {
      this.logger.info("Adding expenses");
      await this.accountingRepository.addExpenses(expenses);
    } catch (error: any) {
      this.logger.error("Can't add expenses");
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
    chargeMonth: ChargeMonth
  ): Promise<AccountingTypes.AccountSummery> {
    try {
      const account = await this.accountService.get(accountId);

      if (!account) {
        throw new CriticalError(
          `Can't get account summery. account_${accountId} doesn't exists.`,
          null,
          {
            accountId,
            chargeMonth,
          }
        );
      }

      const config = await this.accountConfigurationService.get(accountId);

      if (!config) {
        throw new CriticalError(
          `Can't get account summery. account_${accountId} configuration doesn't exists.`,
          null,
          {
            accountId,
            chargeMonth,
          }
        );
      }

      const dates = this.getDatesForAccountSummer(chargeMonth);
      const expenses = await this.accountingRepository.find({
        $or: [
          {
            accountId,
            chargeDate: {
              $gte: dates.chargeLowerBoundary,
              $lte: dates.chargeUpperBoundary,
            },
          },
          {
            accountId,
            chargeDate: { $exists: false },
            timestamp: {
              $gte: dates.timestampLowerBoundary,
              $lte: dates.timestampUpperBoundary,
            },
          },
        ],
      });

      if (!expenses.length) {
        throw new Error("No expenses for this charge month");
      }

      const incomes = await this.salaryService.findSalaries({ accountId });

      const incomeAmount = (incomes || []).reduce(
        (acc, income) => acc + income.amount,
        0
      );

      const expenseAmount = expenses.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );

      const totalBudget = config.budget?.totalBudget ?? incomeAmount;

      const accountSummery: AccountingTypes.AccountSummery = {
        incomeAmount,
        totalBudget,
        expenseAmount,
        balance: totalBudget - expenseAmount,
        categoriesSummery: this.getCategoriesSummery(expenses, config),
      };

      return accountSummery;
    } catch (error: any) {
      this.logger.error(`Can't get account summery: ${error?.message}`);
      throw error;
    }
  }

  private getDatesForAccountSummer(chargeMonth: ChargeMonth): {
    chargeLowerBoundary: Date;
    chargeUpperBoundary: Date;
    timestampLowerBoundary: Date;
    timestampUpperBoundary: Date;
  } {
    const chargeLowerBoundary = new Date(
      Number(chargeMonth.year),
      Number(chargeMonth.month) - 2,
      this.config.accountingSummeryDatesWindow.lowerChargeDay + 1,
      0
    );

    const chargeUpperBoundary = new Date(
      Number(chargeMonth.year),
      Number(chargeMonth.month) - 1,
      this.config.accountingSummeryDatesWindow.upperChargeDay + 1,
      0
    );

    const timestampLowerBoundary = new Date(
      Number(chargeMonth.year),
      Number(chargeMonth.month) - 2,
      this.config.accountingSummeryDatesWindow.lowerTimestampDay + 1,
      0
    );

    const timestampUpperBoundary = new Date(
      Number(chargeMonth.year),
      Number(chargeMonth.month) - 1,
      this.config.accountingSummeryDatesWindow.upperTimestampDay + 1,
      0
    );
    const dates = {
      chargeLowerBoundary,
      chargeUpperBoundary,
      timestampLowerBoundary,
      timestampUpperBoundary,
    };

    return dates;
  }

  private getCategoriesSummery(
    expenses: AccountingTypes.Expense[],
    accountConfig: AccountConfigurationTypes.AccountConfiguration
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
