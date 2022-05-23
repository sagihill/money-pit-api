// tslint:disable-next-line: no-namespace
export namespace AccountingTypes {
  // export interface IAccountingService {
  // 	createAccount(id: string)
  // 	registerExpense(accountId: string, expense: Expense, isConst: boolean): Promise<string>;
  // 	getMonthlyAccountSummary(
  // 		accountId: string,
  // 		year: number,
  // 		month: number
  // 	): Promise<AccountSummary>;
  // 	getMonthlyAccountExpenses(
  // 		accountId: string,
  // 		year: number,
  // 		month: number
  // 	): Promise<Expense[]>;
  // 	getMostFrequentExpenses(accountId: string): Promise<Expense[]>;
  // }

  // export interface IAccountingRepository {}

  // export type Account = {
  // 	id: string;
  // 	type: AccountType;
  // 	members: string[];
  // 	adminId: string;
  // };

  export type Expense = {
    category: ExpenseCategory;
    name: string;
    amount: number;
    currency: Currency;
    timestamp?: Date;
  };

  export interface Income {
    amount: number;
    timestamp?: Date;
    currency: Currency;
  }
  export interface Salary extends Income {
    payDay: number;
  }

  export enum Currency {
    ILS = "ILS",
    USD = "USD",
    EUR = "EUR",
  }

  export enum ExpenseCategory {}
}
