import {
  AccountTypes,
  ExpenseSheetsTypes,
  ExpenseProcessorTypes,
  LoggerTypes,
} from "../../types";
import { TaskTypes } from "../../types/task-types";
import { AddNewExpensesTask } from "./tasks/add-new-expenses";

export class TaskService implements TaskTypes.ITaskService {
  private tasks: TaskTypes.ITask[] = [];
  constructor(
    private readonly accountService: AccountTypes.IAccountService,
    private readonly expenseSheets: ExpenseSheetsTypes.IExpenseSheets,
    private readonly expenseProcessor: ExpenseProcessorTypes.IExpenseProcessor,
    private readonly logger: LoggerTypes.ILogger,
    private readonly configuration: TaskTypes.TaskServiceConfiguration
  ) {
    this.initTasks();
  }

  async run(): Promise<void> {
    for await (const task of this.tasks) {
      await task.schedule();
    }
  }

  initTasks(): void {
    const addNewExpensesTask = new AddNewExpensesTask(
      this.accountService,
      this.expenseSheets,
      this.expenseProcessor,
      {
        ...this.configuration.addNewExpenseTaskOptions,
      },
      this.logger
    );

    this.tasks.push(addNewExpensesTask);
  }
}
