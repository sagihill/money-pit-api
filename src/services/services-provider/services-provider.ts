import {
  LoggerTypes,
  UserTypes,
  MongoTypes,
  AccountTypes,
  AuthTypes,
  AccountingTypes,
  ExpenseProcessorTypes,
  ConfigTypes,
  ExpenseSheetsDownloaderTypes,
  RecurrentExpenseTypes,
  AccountConfigurationTypes,
  CreditAccountTypes,
  SalaryTypes,
  ValidationTypes,
} from "../../types";

import { TaskTypes } from "../../types/task-types";
import { CreationMode } from "./types";
import { Providers } from "./providers";
import { CriticalError } from "../../errors/service-error";

export class ServicesProvider {
  protected SP: any;

  private static instance: ServicesProvider;

  static get(): ServicesProvider {
    if (!this.instance) {
      this.instance = new ServicesProvider();
    }
    return this.instance;
  }

  private constructor() {
    this.initLibrary();
  }

  async User(): Promise<UserTypes.IUserService> {
    try {
      return await this.getProvider<UserTypes.IUserService, {}>(
        "User",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Auth(): Promise<AuthTypes.IAuthService> {
    try {
      return await this.getProvider<AuthTypes.IAuthService, {}>(
        "Auth",
        {},
        CreationMode.instance
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Account(): Promise<AccountTypes.IAccountService> {
    try {
      return await this.getProvider<AccountTypes.IAccountService, {}>(
        "Account",
        {},
        CreationMode.instance
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async AccountConfiguration(): Promise<AccountConfigurationTypes.IAccountConfigurationService> {
    try {
      return await this.getProvider<
        AccountConfigurationTypes.IAccountConfigurationService,
        {}
      >("AccountConfiguration", {}, CreationMode.instance);
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async RecurrentExpense(): Promise<RecurrentExpenseTypes.IReccurentExpensesService> {
    try {
      return await this.getProvider<
        RecurrentExpenseTypes.IReccurentExpensesService,
        {}
      >("RecurrentExpense", {}, CreationMode.singleton);
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Accounting(): Promise<AccountingTypes.IAccountingService> {
    try {
      return await this.getProvider<AccountingTypes.IAccountingService, {}>(
        "Accounting",
        {},
        CreationMode.instance
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async ExpenseProcessor(): Promise<ExpenseProcessorTypes.IExpenseProcessor> {
    try {
      return await this.getProvider<
        ExpenseProcessorTypes.IExpenseProcessor,
        {}
      >("ExpenseProcessor", {}, CreationMode.singleton);
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async ExpenseSheetsDownloader(): Promise<ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader> {
    try {
      return await this.getProvider<
        ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader,
        {}
      >("ExpenseSheetsDownloader", {}, CreationMode.singleton);
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Task(): Promise<TaskTypes.ITaskService> {
    try {
      return await this.getProvider<TaskTypes.ITaskService, {}>(
        "Task",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async CreditAccount(): Promise<CreditAccountTypes.ICreditAccountService> {
    try {
      return await this.getProvider<
        CreditAccountTypes.ICreditAccountService,
        {}
      >("CreditAccount", {}, CreationMode.singleton);
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Salary(): Promise<SalaryTypes.ISalaryService> {
    try {
      return await this.getProvider<SalaryTypes.ISalaryService, {}>(
        "Salary",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async AccountReader(): Promise<AccountTypes.IAccountReaderService> {
    try {
      return await this.getProvider<AccountTypes.IAccountReaderService, {}>(
        "AccountReader",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Validation(): Promise<ValidationTypes.IValidationService> {
    try {
      return await this.getProvider<ValidationTypes.IValidationService, {}>(
        "Validation",
        {},
        CreationMode.instance
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Logger(): Promise<LoggerTypes.ILogger> {
    try {
      return await this.getProvider<LoggerTypes.ILogger, {}>(
        "Logger",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Config(): Promise<ConfigTypes.IConfigService> {
    try {
      return await this.getProvider<ConfigTypes.IConfigService, {}>(
        "Config",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Mongo(): Promise<MongoTypes.IMongo> {
    try {
      return await this.getProvider<MongoTypes.IMongo, {}>(
        "Mongo",
        {},
        CreationMode.singleton
      );
    } catch (error: any) {
      await this.log(error);
      throw error;
    }
  }

  async Release() {
    (await this.Mongo()).disconnect();
    await this.initLibrary();
  }

  initLibrary() {
    this.SP = {};
  }

  private async getProvider<T, O>(
    name: string,
    options: O,
    creationMode: CreationMode
  ): Promise<T> {
    let provider;
    switch (creationMode) {
      case CreationMode.singleton:
        provider = await this.getFromLibrary<T>(name);
        if (provider) {
          return provider;
        }
      // eslint-disable-next-line no-fallthrough
      case CreationMode.instance:
        provider = await Providers[name](options, this);
        await this.setLibrary<T>(name, provider);
        return provider;
      default:
        throw new CriticalError(`Service provider of ${name} is not found.`);
    }
  }

  private async getFromLibrary<T>(name: string): Promise<T> {
    const provider = this.SP[name];
    return provider as T;
  }

  private async setLibrary<T>(name: string, provider: T): Promise<void> {
    if (!this.SP[name]) {
      this.SP[name] = provider;
    }
  }

  private async log(error: Error): Promise<void> {
    const logger = await this.Logger();
    await logger.error(error);
  }
}
