// import { UserInfo } from "os";
// import { Currency, Income, UserTypes } from ".";

// // tslint:disable-next-line: no-namespace
// export namespace AccountingTypes {
// 	export interface IAccountingService {
// 		createAccount()
// 		registerExpense(accountId: string, expense: Expense, isConst: boolean): Promise<string>;
// 		getMonthlyAccountSummary(
// 			accountId: string,
// 			year: number,
// 			month: number
// 		): Promise<AccountSummary>;
// 		getMonthlyAccountExpenses(
// 			accountId: string,
// 			year: number,
// 			month: number
// 		): Promise<Expense[]>;
// 		getMostFrequentExpenses(accountId: string): Promise<Expense[]>;
// 	}

// 	export interface IAccountingRepository {}

// 	export type Account = {
// 		id: string;
// 		type: AccountType;
// 		members: string[];
// 		adminId: string;
// 	};

// 	export enum AccountType {
// 		Family = "family",
// 		Single = "single",
// 	}

// 	export type Expense = {
// 		category: ExpenseCategory;
// 		name: string;
// 		amount: number;
// 		currency: Currency;
// 		timestamp?: Date;
// 	};

// 	export type AccountSummary = {
// 		amount: number;
// 	};

// 	export enum ExpenseCategory {}
// }
