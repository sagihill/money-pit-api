import { RecurrentExpenseTypes } from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { TaskService } from "../../tasks";
import { ServicesProvider } from "../services-provider";

export default async function Task(
  options: any,
  SP: ServicesProvider
): Promise<TaskTypes.ITaskService> {
  const logger = await SP.Logger();
  const accounting = await SP.Accounting();
  const creditAccount = await SP.CreditAccount();
  const accountConfiguration = await SP.AccountConfiguration();
  const notification = await SP.Notification();
  const recurrentExpenses = await SP.RecurrentExpense();
  const expenseSheets = await SP.ExpenseSheetsDownloader();
  const expenseProcessor = await SP.ExpenseProcessor();
  const config = await SP.Config();

  const configuration: TaskTypes.TaskServiceConfiguration = {
    addNewExpenseTaskOptions: {
      creditProvidersUrlMap: await config.getObject("CREDIT_PROVIDERS_URL_MAP"),
      cronInterval: await config.get("ADD_NEW_EXPENSE_TASK_CRON_INTERVAL"),
      isEnabled: await config.getBool("ADD_NEW_EXPENSE_TASK_IS_ENABLED"),
    },
    refreshConfigsTaskOptions: {
      cronInterval: await config.get("REFRESH_CONFIGS_TASK_CRON_INTERVAL"),
      isEnabled: await config.getBool("REFRESH_CONFIGS_TASK_IS_ENABLED"),
    },
    addRecurrentExpensesOptions: {
      monthly: {
        recurrence: RecurrentExpenseTypes.Recurrence.Monthly,
        cronInterval: await config.get(
          "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
        ),
        isEnabled: await config.getBool(
          "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
        ),
      },
      medianly: {
        recurrence: RecurrentExpenseTypes.Recurrence.Medianly,
        cronInterval: await config.get(
          "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
        ),
        isEnabled: await config.getBool(
          "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
        ),
      },
      semesterly: {
        recurrence: RecurrentExpenseTypes.Recurrence.Semesterly,
        cronInterval: await config.get(
          "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
        ),
        isEnabled: await config.getBool(
          "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
        ),
      },
    },
    ...options,
  };
  const taskService = new TaskService(
    accounting,
    accountConfiguration,
    creditAccount,
    recurrentExpenses,
    expenseSheets,
    expenseProcessor,
    config,
    notification,
    logger,
    configuration
  );
  return taskService;
}
