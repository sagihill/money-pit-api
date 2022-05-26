import {
  LoggerTypes,
  UserTypes,
  MongoTypes,
  AccountTypes,
  AuthTypes,
  AccountingTypes,
  ExpenseProcessorTypes,
  ConfigTypes,
} from "../../types";
import { getLogger } from "../logger";
import { Mongo as MongoProvider } from "../mongo";

import { getUserRepository, UserService } from "../user";
import { AuthService, getAuthRepository } from "../auth";
import { getAccountRepository, AccountService } from "../account";
import { AccountingService, getAccountingRepository } from "../accounting";
import { ExpenseProcessor } from "../expense-processor";
import { ConfigService } from "../config/config-service";
import { getConfigRepository } from "../config/config-repository";

export class ServicesProvider {
  private SP: any;
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
    const logger = await this.Logger();
    try {
      if (!this.SP.User) {
        const repository = getUserRepository();
        const userService = new UserService(repository, logger);
        this.SP.User = userService;
      }
      return this.SP.User;
    } catch (error) {
      logger.error(
        `Something happend while trying to load User from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Auth(): Promise<AuthTypes.IAuthService> {
    const logger = await this.Logger();
    const user = await this.User();
    try {
      if (!this.SP.Auth) {
        const repository = getAuthRepository();
        const auth = new AuthService(user, repository, logger);
        this.SP.Auth = auth;
      }
      return this.SP.Auth;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Auth from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Account(): Promise<AccountTypes.IAccountService> {
    const logger = await this.Logger();
    try {
      if (!this.SP.Account) {
        const repository = getAccountRepository();
        const userService = await this.User();
        const accountService = new AccountService(
          userService,
          repository,
          logger
        );
        this.SP.Account = accountService;
      }
      return this.SP.Account;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Account from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Accounting(): Promise<AccountingTypes.IAccountingService> {
    const logger = await this.Logger();
    try {
      if (!this.SP.Accounting) {
        const repository = getAccountingRepository(logger);
        const accountingService = new AccountingService(repository, logger);
        this.SP.Accounting = accountingService;
      }
      return this.SP.Accounting;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Accounting from Services, error: ${error}`
      );
      throw error;
    }
  }
  async ExpesnseProcessor(): Promise<ExpenseProcessorTypes.IExpenseProcessor> {
    const logger = await this.Logger();
    const accountingService = await this.Accounting();
    const config = await this.Config();
    const options: ExpenseProcessorTypes.ExpenseProcessorOptions = {
      expenseCategoryCategoryMap: (await config.getObject(
        "EXPENSE_CATEGORY_CATEGORY_MAP"
      )) as ExpenseProcessorTypes.CategoryMap,
      expenseCategoryNameMap: (await config.getObject(
        "EXPENSE_CATEGORY_NAME_MAP"
      )) as ExpenseProcessorTypes.CategoryMap,
      expenseSheetsPath: "../../public/expense-sheets",
    };
    try {
      if (!this.SP.ExpesnseProcessor) {
        const expenseProcessor = new ExpenseProcessor(
          accountingService,
          options,
          logger
        );

        this.SP.ExpesnseProcessor = expenseProcessor;
      }
      return this.SP.ExpesnseProcessor;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Expense Processor from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Logger(): Promise<LoggerTypes.ILogger> {
    try {
      if (!this.SP.Logger) {
        this.SP.Logger = getLogger;
      }
      return this.SP.Logger;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(
        `Something happend while trying to load Logger from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Config(): Promise<ConfigTypes.IConfigService> {
    const logger = await this.Logger();
    try {
      if (!this.SP.Config) {
        const repository = getConfigRepository();
        const accountingService = new ConfigService(repository, logger);
        this.SP.Config = accountingService;
      }
      return this.SP.Config;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(
        `Something happend while trying to load Config from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Mongo(): Promise<MongoTypes.IMongo> {
    const logger = await this.Logger();
    try {
      if (!this.SP.Mongo) {
        this.SP.Mongo = new MongoProvider(logger, process.env.MONGO_URL ?? "");
      }
      return this.SP.Mongo;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(
        `Something happend while trying to load Logger from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Release() {
    (await this.Mongo()).disconnect();
    await this.initLibrary();
  }

  initLibrary() {
    this.SP = {
      Logger: undefined,
      User: undefined,
    };
  }
}
