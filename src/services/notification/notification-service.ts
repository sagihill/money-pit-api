/* eslint-disable indent */
import {
  AccountingTypes,
  AccountTypes,
  LoggerTypes,
  NotificationSenderTypes,
  NotificationTypes,
  UserTypes,
} from "../../types";

export class NotificationService
  implements NotificationTypes.INotificationService
{
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
        month: (now.getMonth() + 2).toString(),
      };

      let summery: AccountingTypes.AccountSummery;
      try {
        summery = await this.accounting.getAccountSummery(
          accountId,
          chargeMonth
        );
      } catch (error) {
        return;
      }
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

        subject: `Account Summery for ${`${now.getDate().toString()}/${(
          now.getMonth() + 1
        ).toString()}/${chargeMonth.year}`}`,

        text: JSON.stringify(summery),
        html: `<!DOCTYPE html>
        <html lang="en">
          <body>
            <main>
                <h1>Summery</h1>
                <h2>General</h2>
                <div>
                  <span>Total Income: ${summery.incomeAmount / 100}</span><br>
                  <span>Total Expense: ${summery.expenseAmount / 100}</span><br>
                  <span>Balance: ${summery.balance / 100}</span><br>
                </div><br>
                <div><br>
                <h2>Category Summery</h2><br>
                ${this.getCategoriesSummeryTemplate(
                  summery.categoriesSummery
                )}    
              </div><br>
            </main>
          </body>
        </html>`,
      };

      await this.sender.sendEmail(email);
    } catch (error) {
      this.logger.error(`Failed to send summery to account_${accountId}`);
    }
  }

  getCategoriesSummeryTemplate(
    categoriesSummery: AccountingTypes.CategoriesSummery
  ): string {
    let template = "";
    for (const category of Object.keys(categoriesSummery)) {
      const summery = categoriesSummery[category];
      template += `   <span>Category: ${category}</span><br>
      ${
        summery.budget ? `<span>Budget: ${summery.budget / 100}</span><br>` : ""
      }
      <span>Expense: ${summery.expenseAmount / 100}</span><br>
      ${
        summery.balance
          ? `<span>Balance: ${summery.balance / 100}</span><br>`
          : ""
      }
      <br>`;
    }
    return template;
  }
}
