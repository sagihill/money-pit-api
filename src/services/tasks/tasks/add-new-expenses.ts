import {
  AccountTypes,
  ExpenseProcessorTypes,
  ExpenseSheetsTypes,
  LoggerTypes,
} from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class AddNewExpensesTask extends BaseTask implements TaskTypes.ITask {
  constructor(
    private readonly accountService: AccountTypes.IAccountService,
    private readonly expenseSheets: ExpenseSheetsTypes.IExpenseSheets,
    private readonly expenseProcessor: ExpenseProcessorTypes.IExpenseProcessor,
    options: TaskTypes.TaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super(options, logger);
  }
  async run(): Promise<void> {
    const accounts = await this.accountService.getCreditAccounts();
  }
}
