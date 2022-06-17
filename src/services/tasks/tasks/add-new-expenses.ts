import { ID, Sync } from "../../../lib";
import {
  AccountConfigurationTypes,
  CreditAccountTypes,
  ExpenseProcessorTypes,
  ExpenseSheetsDownloaderTypes,
  LoggerTypes,
} from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class AddNewExpensesTask extends BaseTask implements TaskTypes.ITask {
  constructor(
    private readonly creditAccountService: CreditAccountTypes.ICreditAccountService,
    private readonly accountConfigurationService: AccountConfigurationTypes.IAccountConfigurationService,
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
      const configs = await this.accountConfigurationService.findConfigurations(
        {
          toggles: { enableAutoExpenseAdd: true },
        }
      );

      if (!configs) {
        return;
      }

      for await (const config of configs) {
        const creditAccount =
          await this.creditAccountService.findCreditAccounts({
            accountId: config.accountId,
          });
        for await (const account of creditAccount) {
          const creditProviderWebsiteUrl =
            options.creditProvidersUrlMap[account.creditProvider];

          try {
            await this.expenseSheetsDownloader.run({
              accountId: config.accountId,
              credentials: account.credentials,
              creditProviderWebsiteUrl,
            });

            await Sync.sleep(2000);

            await this.expenseProcessor.processExpenseDownload({
              accountId: config.accountId,
            });

            await Sync.sleep(5000);
          } catch (error: any) {
            this.logger.error(error);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
