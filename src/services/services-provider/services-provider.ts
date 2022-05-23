import { LoggerTypes, UserTypes, MongoTypes, AccountTypes } from "../../types";
import { getLogger } from "../logger";
import { Mongo as MongoProvider } from "../mongo";

import { getUserRepository, UserService } from "../user";
import { getAccountRepository, AccountService } from "../account";

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
