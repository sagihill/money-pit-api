import { MongoRepository } from "../../lib/repository";
import AccountConfiguration from "../../models/AccountConfiguration";
import {
  MongoTypes,
  AccountConfigurationTypes,
  LoggerTypes,
} from "../../types";
import { Model } from "mongoose";

export const getAccountConfigurationRepository = (
  logger: LoggerTypes.ILogger
) => {
  return new AccountConfigurationRepository(AccountConfiguration, logger);
};

export class AccountConfigurationRepository
  extends MongoRepository<
    AccountConfigurationTypes.AccountConfiguration,
    AccountConfigurationTypes.Requests.UpdateConfigurationRequest
  >
  implements
    AccountConfigurationTypes.IAccountConfigurationRepository,
    MongoTypes.Repository<
      AccountConfigurationTypes.AccountConfiguration,
      AccountConfigurationTypes.Requests.UpdateConfigurationRequest
    >
{
  constructor(
    model: Model<AccountConfigurationTypes.AccountConfiguration>,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super(model);
  }

  async update(
    accountId: string,
    request: AccountConfigurationTypes.Requests.UpdateConfigurationRequest
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
