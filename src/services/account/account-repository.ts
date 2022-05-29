import { MongoRepository } from "../../lib/repository";
import Account from "../../models/Account";
import { AccountTypes } from "../../types";

export const getAccountRepository = () => {
  return new AccountsRepository(Account);
};

class AccountsRepository
  extends MongoRepository<
    AccountTypes.AccountDetails,
    AccountTypes.EditAccountRequest
  >
  implements AccountTypes.IAccountRepository
{
  async getCreditAccounts(): Promise<AccountTypes.CreditAccount[]> {
    const accounts = await this.find({
      "accounts.configuration.creditAccounts": { $exists: true, $ne: [] },
    });

    const creditAccounts: AccountTypes.CreditAccount[] = [];

    accounts.forEach((account) => {
      if (account.configuration.creditAccountsConfig) {
        creditAccounts.push({
          accountId: account.id,
          creditAccountsConfig: account.configuration.creditAccountsConfig,
        });
      }
    });

    return creditAccounts;
  }
}
