import { ID, Sync } from "../../../lib/common";
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
    options: TaskTypes.AddNewExpenseTaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super(options, logger);
  }
  async run(): Promise<void> {
    try {
      const options = this.getOptions<TaskTypes.AddNewExpenseTaskOptions>();
      const accounts = await this.accountService.getCreditAccounts();
      for await (const account of accounts) {
        // const creditAccountsConfig = account.creditAccountsConfig;
        const creditAccountsConfig = [account.creditAccountsConfig[1]];

        for await (const accountConfig of creditAccountsConfig) {
          const creditProviderWebsiteUrl =
            options.creditProvidersUrlMap[accountConfig.creditProvider];

          try {
            await this.expenseSheets.run({
              accountId: account.accountId,
              credentials: accountConfig.credentials,
              creditProviderWebsiteUrl,
            });

            await Sync.sleep(2000);

            await this.expenseProcessor.run({
              accountId: account.accountId,
            });

            await Sync.sleep(5000);
          } catch (error) {
            this.logger.error(error);
          }
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
