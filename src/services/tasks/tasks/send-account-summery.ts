import { ID, Sync } from "../../../lib";
import {
  AccountConfigurationTypes,
  CreditAccountTypes,
  ExpenseProcessorTypes,
  ExpenseSheetsDownloaderTypes,
  LoggerTypes,
  NotificationTypes,
} from "../../../types";
import { TaskTypes } from "../../../types/task-types";
import { BaseTask } from "./base-task";

export class SendAccountSummeryTask
  extends BaseTask
  implements TaskTypes.ITask
{
  constructor(
    private readonly notification: NotificationTypes.INotificationService,
    private readonly accountConfigurationService: AccountConfigurationTypes.IAccountConfigurationService,
    options: TaskTypes.SendAccountSummeryTaskOptions,
    logger: LoggerTypes.ILogger
  ) {
    super("SendAccountSummeryTask", options, logger);
  }

  async run(): Promise<void> {
    try {
      this.logger.info("Running send account summery task.");
      const configs = await this.accountConfigurationService.findConfigurations(
        {
          "toggles.enableAccountSummeryEmail": true,
        }
      );

      if (!configs || !configs.length) {
        this.logger.info(
          "Didn't find any account configurations to send account summery."
        );
        return;
      }

      for await (const config of configs) {
        try {
          await this.notification.notifyAccountStatus(config.accountId);
        } catch (error) {
          this.logger.error(error);
        }
      }
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
