import { MongoRepository } from "../../lib/repository";
import Account from "../../models/Account";
import { AccountTypes } from "../../types";

export const getAccountRepository = () => {
  return new AccountsRepository(Account);
};

class AccountsRepository extends MongoRepository<
  AccountTypes.AccountDetails,
  AccountTypes.Requests.UpdateRequest
> {}
