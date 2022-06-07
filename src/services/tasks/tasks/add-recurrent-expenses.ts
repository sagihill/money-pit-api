import { ID, Dates } from "../../../lib/common";
import {
  AccountingTypes,
  ExpenseProcessorTypes,
  ExpenseSheetsDownloaderTypes,
  LoggerTypes,
} from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class AddReccurentExpensesTask
  extends BaseTask
  implements TaskTypes.ITask
{
  constructor(
    private readonly recurrentExpensesService: AccountingTypes.IReccurentExpensesService,
    private readonly accountingService: AccountingTypes.IAccountingService,
    options: TaskTypes.AddRecurrentExpensesTaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super(ID.get(), options, logger);
  }

  async run(): Promise<void> {
    try {
      const options =
        this.getOptions<TaskTypes.AddRecurrentExpensesTaskOptions>();
      const recurrentExpenses =
        await this.recurrentExpensesService.getRecurrentExpenses(
          options.recurrence
        );

      const now = new Date();
      const expenses = [];
      this.logger.info(`Adding ${options.recurrence} recurrent Expenses`);
      for await (const recurrentExpense of recurrentExpenses) {
        const timestamp = Dates.toDate(
          `${now.getFullYear()}-${now.getMonth() + 1}-${
            recurrentExpense.dueDay
          }`,
          "yyyy-mm-dd"
        );

        const id = ID.get(
          [
            recurrentExpense.name,
            recurrentExpense.category,
            recurrentExpense.amount,
            recurrentExpense.accountId,
            timestamp,
          ].join("")
        );

        const expense: AccountingTypes.Expense = {
          id,
          accountId: recurrentExpense.accountId,
          category: recurrentExpense.category,
          name: recurrentExpense.name,
          type: recurrentExpense.type,
          description: recurrentExpense.description,
          amount: Math.floor(recurrentExpense.amount * 100),
          currency: recurrentExpense.currency,
          timestamp,
          deleted: false,
          createdAt: now,
          updatedAt: now,
        };

        expenses.push(expense);
      }
      await this.accountingService.addExpenses(expenses);
    } catch (error) {
      this.logger.error(error);
    }
  }
}