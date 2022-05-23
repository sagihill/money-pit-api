import { LoggerTypes, AccountTypes, UserTypes } from "../../types";
import { createNewAccountDetails } from "./account-factory";

export class AccountService implements AccountTypes.IAccountService {
  constructor(
    private readonly userService: UserTypes.IUserService,
    private readonly accountRepository: AccountTypes.IAccountRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async add(
    request: AccountTypes.AddAccountRequest
  ): Promise<AccountTypes.AccountDetails> {
    try {
      this.logger.info(`Creating account : ${{ request }}`);
      const user = await this.userService.get(request.adminUserId);
      if (!user) {
        throw new Error(
          `Can't create account, user_${request.adminUserId} doesn't exist.`
        );
      }
      const AccountDetails = createNewAccountDetails(request);
      return await this.accountRepository.add(AccountDetails);
    } catch (error) {
      this.logger.error(`Can't create new account: ${{ request, error }}`);
      throw error;
    }
  }

  async edit(
    id: string,
    request: AccountTypes.EditAccountRequest
  ): Promise<void> {
    try {
      this.logger.info(`Editing account : ${{ id, request }}`);
      await this.accountRepository.edit(id, request);
    } catch (error) {
      this.logger.error(`Can't edit account: ${{ id, request, error }}`);
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

  async remove(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting account : ${{ id }}`);
      return await this.accountRepository.remove(id);
    } catch (error) {
      this.logger.error(`Can't remove account: ${{ id, error }}`);
    }
  }
}
