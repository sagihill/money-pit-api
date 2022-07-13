import Account from "./Account";
import AccountReader from "./AccountReader";
import AccountConfiguration from "./AccountConfiguration";
import Accounting from "./Accounting";
import Auth from "./Auth";
import Config from "./Config";
import CreditAccount from "./CreditAccount";
import Crypto from "./Crypto";
import ExpenseProcessor from "./ExpenseProcessor";
import ExpenseSheetsDownloader from "./ExpenseSheetsDownloader";
import Logger from "./Logger";
import Mongo from "./Mongo";
import Migrate from "./Migrate";
import NotificationSender from "./NotificationSender";
import Notification from "./Notification";
import RecurrentExpense from "./RecurrentExpense";
import Task from "./Task";
import Salary from "./Salary";
import User from "./User";
import Validation from "./Validation";

export const Providers: any = {
  Account,
  AccountReader,
  AccountConfiguration,
  Accounting,
  Auth,
  Config,
  Crypto,
  CreditAccount,
  ExpenseProcessor,
  ExpenseSheetsDownloader,
  Logger,
  Mongo,
  Notification,
  NotificationSender,
  Migrate,
  RecurrentExpense,
  Task,
  Salary,
  User,
  Validation,
};
