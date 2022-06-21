import { ID, Dates } from "../../../lib";
import {
  AccountingTypes,
  RecurrentExpenseTypes,
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
    private readonly recurrentExpensesService: RecurrentExpenseTypes.IReccurentExpensesService,
    private readonly accountingService: AccountingTypes.IAccountingService,
    options: TaskTypes.AddRecurrentExpensesTaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super("AddReccurentExpensesTask", options, logger);
  }

  async run(): Promise<void> {
    try {
      const options =
        this.getOptions<TaskTypes.AddRecurrentExpensesTaskOptions>();
      const recurrentExpenses =
        await this.recurrentExpensesService.findRecurrentExpenses({
          recurrence: options.recurrence,
        });

      const now = new Date();
      const expenses = [];
      this.logger.info(`Adding ${options.recurrence} recurrent Expenses`);
      for await (const recurrentExpense of recurrentExpenses) {
        const string = `${now.getFullYear()}-${now.getMonth() + 1}-${
          recurrentExpense.dueDay
        }`;
        const timestamp = Dates.toDate(string, "yyyy-mm-dd");

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
          amount: Math.floor(Number(recurrentExpense.amount) * 100),
          currency: recurrentExpense.currency,
          timestamp,
          deleted: false,
          createdAt: now,
          updatedAt: now,
        };

        expenses.push(expense);
      }

      await this.accountingService.addExpenses(expenses);
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
