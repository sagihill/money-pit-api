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
    try {
      this.logger.info(`updating configuration for account_${accountId}`);
      await this.model.updateOne(
        { accountId },
        { $set: { ...request } },
        { upsert: true }
      );
    } catch (error) {
      this.logger.error(`Can't update configuration for account_${accountId}`);
      throw error;
    }
  }

  async findConfigurations(
    request: AccountConfigurationTypes.Requests.FindConfigurationRequest
  ): Promise<AccountConfigurationTypes.AccountConfiguration[] | undefined> {
    try {
      this.logger.info(`Finding configurations : ${{ request }}`);
      return await this.model.find({
        deleted: false,
        ...request,
      });
    } catch (error) {
      this.logger.error(`Can't Finding configurations: ${{ request, error }}`);
      throw error;
    }
  }
}
