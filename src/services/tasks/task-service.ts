import {
  AccountTypes,
  ExpenseSheetsDownloaderTypes,
  ExpenseProcessorTypes,
  LoggerTypes,
  AccountingTypes,
  ConfigTypes,
  RecurrentExpenseTypes,
  AccountConfigurationTypes,
  CreditAccountTypes,
  NotificationTypes,
} from "../../types";
import { TaskTypes } from "../../types/task-types";
import {
  AddNewExpensesTask,
  AddReccurentExpensesTask,
  RefreshConfigsTask,
} from "./tasks";
import { SendAccountSummeryTask } from "./tasks/send-account-summery";

export class TaskService implements TaskTypes.ITaskService {
  private tasks: TaskTypes.ITask[] = [];

  constructor(
    private readonly accountingService: AccountingTypes.IAccountingService,
    private readonly accountConfigurationService: AccountConfigurationTypes.IAccountConfigurationService,
    private readonly creditAccountService: CreditAccountTypes.ICreditAccountService,
    private readonly recurrentExpensesService: RecurrentExpenseTypes.IReccurentExpensesService,
    private readonly expenseSheets: ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader,
    private readonly expenseProcessor: ExpenseProcessorTypes.IExpenseProcessor,
    private readonly configService: ConfigTypes.IConfigService,
    private readonly notification: NotificationTypes.INotificationService,
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

  async runTask(id: string): Promise<void> {
    const task = this.tasks.find((task) => task.getId() == id);
    await task?.run();
  }

  initTasks(): void {
    const addNewExpensesTask = new AddNewExpensesTask(
      this.creditAccountService,
      this.accountConfigurationService,
      this.expenseSheets,
      this.expenseProcessor,
      {
        ...this.configuration.addNewExpenseTaskOptions,
      },
      this.logger
    );

    const addMonthlyRecurrentExpensesTask = new AddReccurentExpensesTask(
      this.recurrentExpensesService,
      this.accountingService,
      {
        ...this.configuration.addRecurrentExpensesOptions.monthly,
      },
      this.logger
    );

    const addMedianlyRecurrentExpensesTask = new AddReccurentExpensesTask(
      this.recurrentExpensesService,
      this.accountingService,
      {
        ...this.configuration.addRecurrentExpensesOptions.medianly,
      },
      this.logger
    );

    const addSemesterlyRecurrentExpensesTask = new AddReccurentExpensesTask(
      this.recurrentExpensesService,
      this.accountingService,
      {
        ...this.configuration.addRecurrentExpensesOptions.semesterly,
      },
      this.logger
    );

    const refreshConfig = new RefreshConfigsTask(
      this.configService,
      { ...this.configuration.refreshConfigsTaskOptions },
      this.logger
    );

    const sendAccountSummeryTask = new SendAccountSummeryTask(
      this.notification,
      this.accountConfigurationService,
      { ...this.configuration.sendAccountSummeryTaskOptions },
      this.logger
    );

    this.tasks.push(
      addNewExpensesTask,
      addMonthlyRecurrentExpensesTask,
      addMedianlyRecurrentExpensesTask,
      addSemesterlyRecurrentExpensesTask,
      refreshConfig,
      sendAccountSummeryTask
    );
  }

  async addTask(task: TaskTypes.ITask): Promise<void> {
    this.tasks.push(task);
  }
}
