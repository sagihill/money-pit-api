import { ID, Validate } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  AccountTypes,
  AccountConfigurationTypes,
  LoggerTypes,
  MongoTypes,
  AccountingTypes,
  RequiredParameterError,
  IContext,
} from "../../types";

export class AccountConfigurationService
  extends SimpleService<
    AccountConfigurationTypes.AccountConfiguration,
    AccountConfigurationTypes.Requests.AddRequest,
    AccountConfigurationTypes.Requests.UpdateRequest
  >
  implements AccountConfigurationTypes.IAccountConfigurationService
{
  constructor(
    private readonly accountService: AccountTypes.IAccountService,
    repository: MongoTypes.Repository<
      AccountConfigurationTypes.AccountConfiguration,
      AccountConfigurationTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async findConfigurations(
    request: AccountConfigurationTypes.Requests.FindRequest
  ): Promise<AccountConfigurationTypes.AccountConfiguration[] | undefined> {
    try {
      this.logger.info(
        `Running findConfigurations on ${this.constructor.name}`
      );
      const configs = await this.repository.find({
        ...request,
        deleted: false,
      });
      return configs;
    } catch (error) {
      this.logger.error(
        `Error on findConfigurations function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async createEntityDetails(
    request: AccountConfigurationTypes.Requests.AddRequest
  ): Promise<AccountConfigurationTypes.AccountConfiguration> {
    const creditAccount = {
      ...request,
      ...(await this.getBaseEntityDetails()),
      id: ID.get(),
    };
    return creditAccount;
  }

  async createValidation(
    request: AccountConfigurationTypes.Requests.AddRequest
  ): Promise<void> {
    await this.isAccountExistValidation(request.accountId);
    if (request.budget) {
      this.validateBudget(request.budget);
    }
  }

  async updateValidation(
    id: string,
    request: AccountConfigurationTypes.Requests.UpdateRequest
  ): Promise<void> {
    if (request.budget) {
      this.validateBudget(request.budget);
    }
  }

  private async isAccountExistValidation(accountId: string): Promise<void> {
    if (!accountId) {
      throw new RequiredParameterError("accountId");
    }
    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
  }

  private validateBudget(budget: AccountConfigurationTypes.Budget): void {
    if (budget.totalBudget) {
      if (!Validate.isValidAmount(budget.totalBudget)) {
        throw new AccountConfigurationTypes.InvalidBudgetAmount(
          budget.totalBudget
        );
      }
    }

    if (budget.categoriesBudget) {
      for (const category in budget.categoriesBudget) {
        if (
          !Object.values(AccountingTypes.ExpenseCategory).includes(
            category as AccountingTypes.ExpenseCategory
          )
        ) {
          throw new AccountingTypes.InvalidExpenseCategory(
            category as AccountingTypes.ExpenseCategory
          );
        }
      }
    }
  }
}
