/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */

import { ID } from "../../lib";
import { SimpleService } from "../../lib/service";
import {
  AccountTypes,
  CreditAccountTypes,
  CryptoTypes,
  LoggerTypes,
  MongoTypes,
  TechTypes,
} from "../../types";

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
    private readonly crypto: CryptoTypes.ICryptoService,
    repository: MongoTypes.Repository<
      CreditAccountTypes.CreditAccount,
      CreditAccountTypes.Requests.UpdateRequest
    >,
    logger: LoggerTypes.ILogger
  ) {
    super(repository, logger);
  }

  async add(
    request: CreditAccountTypes.Requests.AddRequest
  ): Promise<CreditAccountTypes.CreditAccount> {
    await this.encryptRequest(request);
    const creditAccount = await super.add(request);
    return creditAccount;
  }

  async update(
    id: string,
    request: CreditAccountTypes.Requests.UpdateRequest
  ): Promise<void> {
    await this.encryptRequest(request);
    await super.update(id, request);
  }

  async get(id: string): Promise<CreditAccountTypes.CreditAccount | undefined> {
    const creditAccount = await super.get(id);
    if (creditAccount) {
      await this.decryptCreditAccount(creditAccount);
      return creditAccount;
    }
  }

  async findAccountOne(
    id: string,
    accountId: string
  ): Promise<CreditAccountTypes.CreditAccount | undefined> {
    const creditAccount = await super.findAccountOne(id, accountId);
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

  private async encryptCreditAccount(
    creditAccount: CreditAccountTypes.CreditAccount
  ): Promise<void> {
    const password = await this.crypto.encrypt(
      creditAccount.credentials.password
    );
    creditAccount.credentials.password = password;

    const username = await this.crypto.encrypt(
      creditAccount.credentials.username
    );
    creditAccount.credentials.username = username;
  }

  private async encryptRequest(
    request:
      | CreditAccountTypes.Requests.AddRequest
      | CreditAccountTypes.Requests.UpdateRequest
  ): Promise<void> {
    if (request.credentials?.password) {
      const password = await this.crypto.encrypt(request.credentials.password);
      request.credentials.password = password;
    }

    if (request.credentials?.username) {
      const username = await this.crypto.encrypt(request.credentials.username);
      request.credentials.username = username;
    }
  }

  private async decryptCreditAccount(
    creditAccount: CreditAccountTypes.CreditAccount
  ): Promise<void> {
    const password = await this.crypto.decrypt(
      creditAccount.credentials.password
    );
    creditAccount.credentials.password = password;

    const username = await this.crypto.decrypt(
      creditAccount.credentials.username
    );
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
      throw new TechTypes.RequiredParameterError("accountId");
    }
    const account = await this.accountService.get(accountId);

    if (!account) {
      throw new AccountTypes.AccountNotFound(accountId);
    }
  }
}
