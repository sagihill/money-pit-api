import { MongoRepository } from "../../lib/repository";
import AccountConfiguration from "../../models/AccountConfiguration";
import { AccountConfigurationTypes } from "../../types";

export const getAccountConfigurationRepository = () => {
  return new AccountConfigurationRepository(AccountConfiguration);
};

export class AccountConfigurationRepository extends MongoRepository<
  AccountConfigurationTypes.AccountConfiguration,
  AccountConfigurationTypes.Requests.UpdateRequest
> {}
