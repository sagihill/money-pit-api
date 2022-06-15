/* eslint-disable indent */
import { LoggerTypes, AccountTypes, MongoTypes } from "../../types";

export class AccountReaderService
  implements AccountTypes.IAccountReaderService
{
  constructor(
    private readonly accountUserRepository: MongoTypes.Repository<
      AccountTypes.AccountUserPair,
      {}
    >,
    private readonly repository: MongoTypes.Repository<
      AccountTypes.AccountDetails,
      AccountTypes.Requests.UpdateRequest
    >,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async getByAdminUserId(
    adminUserId: string
  ): Promise<AccountTypes.AccountDetails | undefined> {
    try {
      this.logger.info(`Getting account by admin user id : ${{ adminUserId }}`);
      return (await this.repository.find({ adminUserId, deleted: false }))[0];
    } catch (error: any) {
      this.logger.error(`Can't get account: ${{ adminUserId, error }}`);
    }
  }

  async get(id: string): Promise<AccountTypes.AccountDetails | undefined> {
    try {
      this.logger.info(`Getting account id : ${{ id }}`);
      return await this.repository.get(id);
    } catch (error: any) {
      this.logger.error(`Can't get account: ${{ id, error }}`);
    }
  }

  async getAccountIdByUserId(userId: string): Promise<string | undefined> {
    try {
      this.logger.info(`Getting account id by user id : ${{ userId }}`);
      const pair = (
        await this.accountUserRepository.find({ userId, deleted: false })
      )[0];
      return pair?.accountId;
    } catch (error: any) {
      this.logger.error(`Can't get account id: ${{ userId, error }}`);
    }
  }
}
