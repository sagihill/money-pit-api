import { ID, Validate } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  RecurrentExpenseTypes,
  LoggerTypes,
  MongoTypes,
  AccountTypes,
  RequiredParameterError,
  AccountingTypes,
} from "../../types";

export class ReccurentExpensesService
  extends SimpleService<
    RecurrentExpenseTypes.RecurrentExpense,
    RecurrentExpenseTypes.Requests.AddRequest,
    RecurrentExpenseTypes.Requests.UpdateRequest
  >
  implements RecurrentExpenseTypes.IReccurentExpensesService
{
  constructor(
    private readonly accountService: AccountTypes.IAccountReaderService,
    repository: MongoTypes.Repository<
      RecurrentExpenseTypes.RecurrentExpense,
      RecurrentExpenseTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async addRecurrentExpenses(
    requests: RecurrentExpenseTypes.Requests.AddRequest[]
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    try {
      this.logger.info(
        `Running addRecurrentExpenses on ${this.constructor.name}`
      );
      const recurrentExpenses = [];
      for await (const request of requests) {
        await this.createValidation(request);
        const recurrentExpense = await this.createEntityDetails(request);
        recurrentExpenses.push(recurrentExpense);
      }

      return await this.repository.addMany(recurrentExpenses);
    } catch (error: any) {
      this.logger.error(
        `Error on addRecurrentExpenses function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async findRecurrentExpenses(
    request: RecurrentExpenseTypes.Requests.FindRequest
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    try {
      this.logger.info(
        `Running findRecurrentExpenses on ${this.constructor.name}`
      );
      const recurrentExpenses = await this.repository.find({
        ...request,
        deleted: false,
      });
      return recurrentExpenses;
    } catch (error: any) {
      this.logger.error(
        `Error on findRecurrentExpenses function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async createValidation(
    request: RecurrentExpenseTypes.Requests.AddRequest
  ): Promise<void> {
    await this.isAccountExistValidation(request.accountId);
    Validate.expenseCategory(request.category).required();
    Validate.string("expense name", request.name).required();
    Validate.expenseType(request.type).required();
    Validate.string("expense description", request.description);
    Validate.amount(request.amount).required();
    Validate.currency(request.currency).required();
    Validate.day(request.dueDay).required();
    Validate.expenseRecurrence(request.recurrence).required();
  }

  async updateValidation(
    id: string,
    request: RecurrentExpenseTypes.Requests.UpdateRequest
  ): Promise<void> {
    Validate.required(id, "recurrent expense id");
    Validate.expenseCategory(request.category);
    Validate.string("expense name", request.name);
    Validate.expenseType(request.type);
    Validate.string("expense description", request.description);
    Validate.amount(request.amount);
    Validate.currency(request.currency);
    Validate.day(request.dueDay);
    Validate.expenseRecurrence(request.recurrence);
  }

  async createEntityDetails(
    request: RecurrentExpenseTypes.Requests.AddRequest
  ): Promise<RecurrentExpenseTypes.RecurrentExpense> {
    return {
      id: ID.get(),
      ...request,
      ...(await this.getBaseEntityDetails()),
    };
  }

  private async isAccountExistValidation(accountId: string): Promise<void> {
    Validate.required(accountId, "accountId");

    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
  }
}
