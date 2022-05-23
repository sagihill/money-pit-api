import { MongoRepository } from "../../lib/repository";
import Account from "../../models/Account";
import { AccountTypes } from "../../types";

export const getAccountRepository = () => {
  return new MongoRepository<
    AccountTypes.AccountDetails,
    AccountTypes.EditAccountRequest
  >(Account);
};
