/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import { ID } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  AccountTypes,
  CreditAccountTypes,
  LoggerTypes,
  MongoTypes,
  RequiredParameterError,
} from "../../types";

const Cryptr = require("cryptr");

export class CreditAccountService
  extends SimpleService<
    CreditAccountTypes.CreditAccount,
    CreditAccountTypes.Requests.AddRequest,
    CreditAccountTypes.Requests.UpdateRequest
  >
  implements CreditAccountTypes.ICreditAccountService
{
  constructor(
    private readonly accountService: AccountTypes.IAccountReaderService,
    private readonly cryptr: typeof Cryptr,
    repository: MongoTypes.Repository<
      CreditAccountTypes.CreditAccount,
      CreditAccountTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async get(id: string): Promise<CreditAccountTypes.CreditAccount | undefined> {
    const creditAccount = await super.get(id);
    if (creditAccount) {
      await this.decryptCreditAccount(creditAccount);
      return creditAccount;
    }
  }

  async addCreditAccounts(
    requests: CreditAccountTypes.Requests.AddRequest[]
  ): Promise<CreditAccountTypes.CreditAccount[]> {
    try {
      this.logger.info(`Running addCreditAccounts on ${this.constructor.name}`);
      const creditAccounts = [];
      for await (const request of requests) {
        await this.createValidation(request);
        const creditAccount = await this.createEntityDetails(request);
        this.encryptCreditAccount(creditAccount);
        creditAccounts.push(creditAccount);
      }
      return await this.repository.addMany(creditAccounts);
    } catch (error: any) {
      this.logger.error(
        `Error on addCreditAccounts function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async findCreditAccounts(
    request: CreditAccountTypes.Requests.FindRequest
  ): Promise<CreditAccountTypes.CreditAccount[]> {
    try {
      this.logger.info(
        `Running findCreditAccounts on ${this.constructor.name}`
      );
      const creditAccounts = await this.repository.find({
        ...request,
        deleted: false,
      });

      for (const creditAccount of creditAccounts) {
        await this.decryptCreditAccount(creditAccount);
      }
      return creditAccounts;
    } catch (error: any) {
      this.logger.error(
        `Error on findRecurrentExpenses function of ${this.constructor.name}`
      );
      throw error;
    }
  }

  async createEntityDetails(
    request: CreditAccountTypes.Requests.AddRequest
  ): Promise<CreditAccountTypes.CreditAccount> {
    const creditAccount = {
      ...request,
      ...(await this.getBaseEntityDetails()),
      id: ID.get(),
    };

    this.encryptCreditAccount(creditAccount);

    return creditAccount;
  }

  private encryptCreditAccount(
    creditAccount: CreditAccountTypes.CreditAccount
  ): void {
    const password = this.cryptr.encrypt(creditAccount.credentials.password, 8);
    creditAccount.credentials.password = password;

    const username = this.cryptr.encrypt(creditAccount.credentials.username, 8);
    creditAccount.credentials.username = username;
  }

  private decryptCreditAccount(
    creditAccount: CreditAccountTypes.CreditAccount
  ): void {
    const password = this.cryptr.decrypt(creditAccount.credentials.password, 8);
    creditAccount.credentials.password = password;

    const username = this.cryptr.decrypt(creditAccount.credentials.username, 8);
    creditAccount.credentials.username = username;
  }

  async createValidation(
    request: CreditAccountTypes.Requests.AddRequest
  ): Promise<void> {
    await this.isAccountExistValidation(request.accountId);
  }

  async updateValidation(
    id: string,
    request: CreditAccountTypes.Requests.UpdateRequest
  ): Promise<void> {
    if (
      request.creditProvider &&
      !Object.values(CreditAccountTypes.CreditProvider).includes(
        request.creditProvider
      )
    ) {
      throw new CreditAccountTypes.InvalidCreditProvider(
        request.creditProvider
      );
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
}
