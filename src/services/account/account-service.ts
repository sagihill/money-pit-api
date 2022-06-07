import { ID } from "../../lib";
import {
  LoggerTypes,
  AccountTypes,
  UserTypes,
  RecurrentExpenseTypes,
  AccountConfigurationTypes,
  CriticalError,
} from "../../types";
import { createNewAccountDetails } from "./account-factory";
export class AccountService implements AccountTypes.IAccountService {
  constructor(
    private readonly userService: UserTypes.IUserService,
    private readonly accountRepository: AccountTypes.IAccountRepository,
    private readonly accountConfiguration: AccountConfigurationTypes.IAccountConfigurationService,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(
    request: AccountTypes.Requests.AddAccountRequest
  ): Promise<AccountTypes.AccountDetails> {
    try {
      this.logger.info(`Creating account : ${{ request }}`);
      const user = await this.userService.get(request.adminUserId);
      if (!user) {
        throw new Error(
          `Can't create account, user_${request.adminUserId} doesn't exist.`
        );
      }
      const accountDetails = createNewAccountDetails(request);
      await this.accountConfiguration.update(accountDetails.id, {
        ...request.configuration,
      });
      return await this.accountRepository.add(accountDetails);
    } catch (error) {
      this.logger.error(`Can't create new account: ${{ request, error }}`);
      throw error;
    }
  }

  async editConfiguration(
    id: string,
    request: AccountConfigurationTypes.Requests.UpdateConfigurationRequest
  ): Promise<void> {
    try {
      this.logger.info(`Editing account coniguration: ${{ request }}`);
      await this.accountConfiguration.update(id, {
        ...request,
      });
    } catch (error) {
      this.logger.error(
        `Can't edit account configuration: ${{ request, error }}`
      );
      throw error;
    }
  }

  async displayConfiguration(
    id: string
  ): Promise<AccountConfigurationTypes.AccountConfigurationForDisplay> {
    try {
      this.logger.info(`getting account coniguration for display: ${{ id }}`);
      const config = await this.accountConfiguration.getAccountConfiguration(
        id
      );
      return {
        incomes: config?.incomes,
        budget: config?.budget,
        recurrentExpenses: config?.recurrentExpenses,
      };
    } catch (error) {
      this.logger.error(`Can't edit account configuration: ${{ id, error }}`);
      throw error;
    }
  }

  async get(id: string): Promise<AccountTypes.AccountDetails | undefined> {
    try {
      this.logger.info(`Getting account : ${{ id }}`);
      return await this.accountRepository.get(id);
    } catch (error) {
      this.logger.error(`Can't get account: ${{ id, error }}`);
    }
  }

  async getCreditAccounts(
    accountId: string
  ): Promise<AccountConfigurationTypes.CreditAccount[]> {
    try {
      this.logger.info(`Getting credit accounts`);
      const config = await this.accountConfiguration.getAccountConfiguration(
        accountId
      );
      if (!config || !config.creditAccounts || !config.creditAccounts.length) {
        throw new CriticalError(
          `Can't get credit accounts for account_${accountId}, configuration is missing.`,
          null,
          { accountId }
        );
      }
      return config.creditAccounts;
    } catch (error) {
      this.logger.error(`Can't get credit accounts`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting account : ${{ id }}`);
      return await this.accountRepository.remove(id);
    } catch (error) {
      this.logger.error(`Can't remove account: ${{ id, error }}`);
    }
  }
}
