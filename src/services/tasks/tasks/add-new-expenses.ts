import { ID, Sync } from "../../../lib/common";
import {
  AccountTypes,
  ExpenseProcessorTypes,
  ExpenseSheetsDownloaderTypes,
  LoggerTypes,
} from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class AddNewExpensesTask extends BaseTask implements TaskTypes.ITask {
  constructor(
    private readonly accountService: AccountTypes.IAccountService,
    private readonly expenseSheetsDownloader: ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader,
    private readonly expenseProcessor: ExpenseProcessorTypes.IExpenseProcessor,
    options: TaskTypes.AddNewExpenseTaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super(ID.get(), options, logger);
  }
  async run(): Promise<void> {
    try {
      const options = this.getOptions<TaskTypes.AddNewExpenseTaskOptions>();
      const accounts = await this.accountService.getCreditAccounts();
      for await (const account of accounts) {
        // const creditAccountsConfig = account.creditAccountsConfig;
        const creditAccountsConfig = account.creditAccountsConfig;

        for await (const accountConfig of creditAccountsConfig) {
          const creditProviderWebsiteUrl =
            options.creditProvidersUrlMap[accountConfig.creditProvider];

          try {
            await this.expenseSheetsDownloader.run({
              accountId: account.accountId,
              credentials: accountConfig.credentials,
              creditProviderWebsiteUrl,
            });

            await Sync.sleep(2000);

            await this.expenseProcessor.processExpenseDownload({
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
