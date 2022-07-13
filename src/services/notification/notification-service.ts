import {
  AccountingTypes,
  AccountTypes,
  LoggerTypes,
  NotificationSenderTypes,
  NotificationTypes,
  UserTypes,
} from "../../types";

export class NotificationService implements NotificationTypes.INotificationService {
  constructor(
    private readonly userService: UserTypes.IUserService,
    private readonly accountService: AccountTypes.IAccountReaderService,
    private readonly accounting: AccountingTypes.IAccountingService,
    private readonly sender: NotificationSenderTypes.INotificationSender,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async notifyAccountStatus(accountId: string): Promise<void> {
    try {
      const now = new Date();
      const chargeMonth = {
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString(),
      };
      const summery = this.accounting.getAccountSummery(accountId, chargeMonth);
      const account = await this.accountService.get(accountId);
      if (!account) {
        throw new Error(
          `Can't send summery email to account ${accountId} account doesnt exist`
        );
      }
      const user = await this.userService.getUserInfo({
        id: account.adminUserId,
      });
      if (!user) {
        throw new Error(
          `Can't send summery email to account ${accountId} account user doesnt exist`
        );
      }
      const email = {
        from: "MoneyPit notfication@money-pit.io",
        to: user.email,

        subject: `Account Summery for ${`${now.getDate().toString()}/${
          chargeMonth.month
        }/${chargeMonth.year}`}`,

        text: JSON.stringify(summery),
      };

      await this.sender.sendEmail(email);
    } catch (error) {
      this.logger.error(`Failed to send summery to account_${accountId}`);
    }
  }
}
