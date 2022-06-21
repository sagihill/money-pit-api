export * as UserController from "./user";
export * as AccountController from "./account";
export * as AccountingController from "./accounting";
export * as AccountConfigurationController from "./account-configuration";
export * as AuthController from "./auth";
export * as CreditAccountController from "./credit-account";
export * as RecurrentExpenseController from "./recurrent-expense";
export * as SalaryController from "./salary";
import { Query } from "express-serve-static-core";
export { ParamsDictionary } from "express-serve-static-core";
class StringsQuery implements Query {
  [key: string]: string;
}

export const Strings = new StringsQuery() as Query;
