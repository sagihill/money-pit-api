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
import { ExpenseSheetsDownloader } from "../expense-sheets-downloader";
import { getProcessorLogsRepository } from "../expense-processor/processor-logs-repository";
import { TaskTypes } from "../../types/task-types";
import { TaskService } from "../tasks/task-service";
import {
  getReccurentExpensesRepository,
  ReccurentExpensesService,
} from "../recurrent-expenses";
import {
  AccountConfigurationService,
  getAccountConfigurationRepository,
} from "../account-configuration";

const Cryptr = require("cryptr");
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
    const config = await this.Config();
    const recurrentExpenseService = await this.RecurrentExpense();
    const userService = await this.User();
    try {
      if (!this.SP.Account) {
        const accountRepo = getAccountRepository();
        const crypter = new Cryptr(await config.get("CREDIT_ACCOUNTS_SECRET"));
        const accountService = new AccountService(
          userService,
          accountRepo,
          recurrentExpenseService,
          crypter,
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

  async AccountConfiguration(): Promise<AccountConfigurationTypes.IAccountConfigurationService> {
    const logger = await this.Logger();
    const account = await this.Account();
    const recurrentExpenseService = await this.RecurrentExpense();
    try {
      if (!this.SP.AccountConfiguration) {
        const repo = getAccountConfigurationRepository(logger);
        const accountConfigurationService = new AccountConfigurationService(
          repo,
          recurrentExpenseService,
          account,
          logger
        );
        this.SP.AccountConfiguration = accountConfigurationService;
      }
      return this.SP.AccountConfiguration;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Account Configuration from Services, error: ${error}`
      );
      throw error;
    }
  }

  async RecurrentExpense(): Promise<RecurrentExpenseTypes.IReccurentExpensesService> {
    const logger = await this.Logger();
    try {
      if (!this.SP.RecurrentExpense) {
        const repo = getReccurentExpensesRepository();
        const recurrentExpenseService = new ReccurentExpensesService(
          repo,
          logger
        );

        this.SP.RecurrentExpense = recurrentExpenseService;
      }
      return this.SP.ReccurentExpensesService;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Recurrent Expense from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Accounting(): Promise<AccountingTypes.IAccountingService> {
    const logger = await this.Logger();
    const account = await this.Account();
    const config = await this.Config();

    const options: AccountingTypes.AccountingServiceConfiguration = {
      accountingSummeryDatesWindow: {
        lowerChargeDay: await config.getNumber("LOWER_CHARGE_DAY"),
        upperChargeDay: await config.getNumber("UPPER_CHARGE_DAY"),
        lowerTimestampDay: await config.getNumber("LOWER_TIMESTAMP_DAY"),
        upperTimestampDay: await config.getNumber("UPPER_TIMESTAMP_DAY"),
      },
    };
    try {
      if (!this.SP.Accounting) {
        const repository = getAccountingRepository(logger);
        const accountingService = new AccountingService(
          account,
          repository,
          options,
          logger
        );
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
    const accountService = await this.Account();
    const config = await this.Config();
    const options: ExpenseProcessorTypes.ExpenseProcessorOptions = {
      expenseCategoryCategoryMap: await config.getObject(
        "EXPENSE_CATEGORY_CATEGORY_MAP"
      ),
      expenseCategoryNameMap: await config.getObject(
        "EXPENSE_CATEGORY_NAME_MAP"
      ),
      expenseNameFormatConfig: await config.getObject(
        "EXPENSE_NAME_FORMAT_CONFIG"
      ),
      expenseSheetsPath: "../../expense-sheets",
      skipAllreadyProcessed: await config.getBool(
        "SKIP_ALLREADY_PROCESSED_SHEETS"
      ),
    };
    try {
      if (!this.SP.ExpesnseProcessor) {
        const logsRepo = getProcessorLogsRepository(logger);
        const expenseProcessor = new ExpenseProcessor(
          accountingService,
          accountService,
          logsRepo,
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

  async ExpenseSheetsDownloader(): Promise<ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader> {
    const logger = await this.Logger();
    const options: ExpenseSheetsDownloaderTypes.ExpenseSheetsOptions = {
      expenseSheetsPath: "../../expense-sheets",
    };
    try {
      if (!this.SP.ExpenseSheetsDownloader) {
        const expenseSheetsDownloader = new ExpenseSheetsDownloader(
          options,
          logger
        );

        this.SP.ExpenseSheetsDownloader = expenseSheetsDownloader;
      }
      return this.SP.ExpenseSheetsDownloader;
    } catch (error) {
      logger.error(
        `Something happend while trying to load Expense Sheets downloader from Services, error: ${error}`
      );
      throw error;
    }
  }

  async Task(): Promise<TaskTypes.ITaskService> {
    const logger = await this.Logger();
    const account = await this.Account();
    const accounting = await this.Accounting();
    const recurrentExpenses = await this.RecurrentExpense();
    const expenseSheets = await this.ExpenseSheetsDownloader();
    const expenseProcessor = await this.ExpesnseProcessor();
    const config = await this.Config();

    const options: TaskTypes.TaskServiceConfiguration = {
      addNewExpenseTaskOptions: {
        creditProvidersUrlMap: await config.getObject(
          "CREDIT_PROVIDERS_URL_MAP"
        ),
        cronInterval: await config.get("ADD_NEW_EXPENSE_TASK_CRON_INTERVAL"),
        isEnabled: await config.getBool("ADD_NEW_EXPENSE_TASK_IS_ENABLED"),
      },
      refreshConfigsTaskOptions: {
        cronInterval: await config.get("REFRESH_CONFIGS_TASK_CRON_INTERVAL"),
        isEnabled: await config.getBool("REFRESH_CONFIGS_TASK_IS_ENABLED"),
      },
      addRecurrentExpensesOptions: {
        monthly: {
          recurrence: RecurrentExpenseTypes.Recurrence.Monthly,
          cronInterval: await config.get(
            "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
          ),
          isEnabled: await config.getBool(
            "ADD_MONTHLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
          ),
        },
        medianly: {
          recurrence: RecurrentExpenseTypes.Recurrence.Medianly,
          cronInterval: await config.get(
            "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
          ),
          isEnabled: await config.getBool(
            "ADD_MEDIANLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
          ),
        },
        semesterly: {
          recurrence: RecurrentExpenseTypes.Recurrence.Semesterly,
          cronInterval: await config.get(
            "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_CRON_INTERVAL"
          ),
          isEnabled: await config.getBool(
            "ADD_SEMESTERLY_RECURRENT_EXPENSES_TASK_IS_ENABLED"
          ),
        },
      },
    };
    try {
      if (!this.SP.Task) {
        this.SP.Task = new TaskService(
          account,
          accounting,
          expenseSheets,
          expenseProcessor,
          recurrentExpenses,
          config,
          logger,
          options
        );
      }
      return this.SP.Task;
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.error(
        `Something happend while trying to load Task from Services, error: ${error}`
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
