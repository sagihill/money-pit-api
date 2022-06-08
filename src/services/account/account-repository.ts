import { MongoRepository } from "../../lib/repository";
import Account from "../../models/Account";
import { AccountTypes } from "../../types";

export const getAccountRepository = () => {
  return new AccountsRepository(Account);
};

class AccountsRepository
  extends MongoRepository<
    AccountTypes.AccountDetails,
    AccountTypes.Requests.EditAccountRequest
  >
  implements AccountTypes.IAccountRepository
{
  async getByAdminUserId(
    adminUserId: string
  ): Promise<AccountTypes.AccountDetails | undefined> {
    const result = await this.find({ deleted: false, adminUserId });
    return result[0];
  }
}
