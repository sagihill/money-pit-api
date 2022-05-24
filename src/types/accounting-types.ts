import { EntityDetails, TimeFrame } from ".";

// tslint:disable-next-line: no-namespace
export namespace AccountingTypes {
  export interface IAccountingService {
    addExpenses(expenses: Expense[]): Promise<void>;
    getAccountSummery(
      accountId: string,
      timeFrame: TimeFrame
    ): Promise<AccountSummery>;
  }

  export interface IAccountingRepository {
    addExpenses(expenses: Expense[]): Promise<void>;
    getExpenses(accountId: string, timeFrame: TimeFrame): Promise<Expense[]>;
  }

  export type AccountSummery = {
    expenseAmount: number;
    incomeAmount: number;
    balance: number;
    categoriesSummery: CategoriesSummery;
  };

  export type CategoriesSummery = {
    [key: string]: CategorySummery;
  };

  export type CategorySummery = {
    expenseAmount: number;
    budget: number;
    balance: number;
  };
  export interface Expense extends EntityDetails {
    id: string;
    accountId: string;
    category: ExpenseCategory;
    name: string;
    amount: number;
    currency: Currency;
  }

  export interface EditExpenseRequest {
    category: ExpenseCategory;
    name: string;
    amount: number;
    currency: Currency;
  }

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

  export enum ExpenseCategory {
    Food = "food",
    USD = "USD",
    EUR = "EUR",
  }
}
