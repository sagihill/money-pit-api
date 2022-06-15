import { MongoRepository } from "../../lib/repository";
import AccountUserPair from "../../models/AccountUserPair";
import { AccountTypes } from "../../types";

export const getAccountUserRepository = () => {
  return new AccountUserRepository(AccountUserPair);
};

class AccountUserRepository extends MongoRepository<
  AccountTypes.AccountUserPair,
  {}
> {}
