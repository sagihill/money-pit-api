import { ID } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  AccountTypes,
  SalaryTypes,
  LoggerTypes,
  MongoTypes,
  DomainTypes,
  TechTypes,
} from "../../types";

export class SalaryService
  extends SimpleService<
    SalaryTypes.Salary,
    SalaryTypes.Requests.AddRequest,
    SalaryTypes.Requests.UpdateRequest
  >
  implements SalaryTypes.ISalaryService
{
  constructor(
    private readonly accountService: AccountTypes.IAccountReaderService,
    repository: MongoTypes.Repository<
      SalaryTypes.Salary,
      SalaryTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async addSalaries(
    requests: SalaryTypes.Requests.AddRequest[]
  ): Promise<SalaryTypes.Salary[]> {
    try {
      this.logger.info(`Running addSalaries on ${this.constructor.name}`);
      const salaries = [];
      for await (const request of requests) {
        await this.createValidation(request);
        const salary = await this.createEntityDetails(request);
        salaries.push(salary);
      }

      return await this.repository.addMany(salaries);
    } catch (error: any) {
      this.logger.error(
        `Error on addSalaries function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async findSalaries(
    request: SalaryTypes.Requests.FindRequest
  ): Promise<SalaryTypes.Salary[]> {
    try {
      this.logger.info(`Running findSalaries on ${this.constructor.name}`);
      const salaries = await this.repository.find({
        ...request,
        deleted: false,
      });
      return salaries;
    } catch (error: any) {
      this.logger.error(
        `Error on findSalaries function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async createEntityDetails(
    request: SalaryTypes.Requests.AddRequest
  ): Promise<SalaryTypes.Salary> {
    const Salary = {
      ...request,
      ...(await this.getBaseEntityDetails()),
      id: ID.get(),
    };

    return Salary;
  }

  async createValidation(
    request: SalaryTypes.Requests.AddRequest
  ): Promise<void> {
    await this.isAccountExistValidation(request.accountId);
  }
  async updateValidation(
    id: string,
    request: SalaryTypes.Requests.UpdateRequest
  ): Promise<void> {
    if (
      request.currency &&
      !Object.values(DomainTypes.Currency).includes(request.currency)
    ) {
      throw new DomainTypes.InvalidCurrency(request.currency);
    }
  }

  private async isAccountExistValidation(accountId: string): Promise<void> {
    if (!accountId) {
      throw new TechTypes.RequiredParameterError("accountId");
    }

    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
  }
}
