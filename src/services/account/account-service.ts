/* eslint-disable import/newline-after-import */
import { ID, Validate } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  LoggerTypes,
  AccountTypes,
  UserTypes,
  RecurrentExpenseTypes,
  AccountConfigurationTypes,
  MongoTypes,
  SalaryTypes,
  CreditAccountTypes,
} from "../../types";
export class AccountService
  extends SimpleService<
    AccountTypes.AccountDetails,
    AccountTypes.Requests.AddRequest,
    AccountTypes.Requests.UpdateRequest
  >
  implements AccountTypes.IAccountService
{
  constructor(
    private readonly userService: UserTypes.IUserService,
    private readonly accountConfigurationService: AccountConfigurationTypes.IAccountConfigurationService,
    private readonly recurrentExpenseService: RecurrentExpenseTypes.IReccurentExpensesService,
    private readonly salaryService: SalaryTypes.ISalaryService,
    private readonly creditAccountService: CreditAccountTypes.ICreditAccountService,
    repository: MongoTypes.Repository<
      AccountTypes.AccountDetails,
      AccountTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async add(
    request: AccountTypes.Requests.AddRequest
  ): Promise<AccountTypes.AccountDetails> {
    const account = await super.add({
      type: request.type,
      adminUserId: request.adminUserId,
    });

    return account;
  }

  async addAccountConfigurations(
    request: AccountTypes.Requests.AddAccountConfigurationRequest
  ): Promise<void> {
    if (request.configuration) {
      await this.accountConfigurationService.add(request.configuration);
    }

    if (request.creditAccounts) {
      await this.creditAccountService.addCreditAccounts(request.creditAccounts);
    }

    if (request.recurrentExpenses) {
      await this.recurrentExpenseService.addRecurrentExpenses(
        request.recurrentExpenses
      );
    }

    if (request.salaries) {
      await this.salaryService.addSalaries(request.salaries);
    }
  }

  async createEntityDetails(
    request: AccountTypes.Requests.AddRequest
  ): Promise<AccountTypes.AccountDetails> {
    return {
      ...(await this.getBaseEntityDetails()),
      type: request.type,
      adminUserId: request.adminUserId,
      members: [request.adminUserId],
      id: ID.get(),
    };
  }

  async createValidation(
    request: AccountTypes.Requests.AddRequest
  ): Promise<void> {
    Validate.required(request.adminUserId, "admin user id");

    const user = await this.userService.get(request.adminUserId);
    if (!user) {
      throw new Error(
        `Can't create account, user_${request.adminUserId} doesn't exist.`
      );
    }

    Validate.accountType(request.type).required();
  }

  async updateValidation(
    id: string,
    request: AccountTypes.Requests.UpdateRequest
  ): Promise<void> {
    Validate.required(id, "account id");
    Validate.accountType(request.type);
  }

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
}
