import { IEntityDetails, Currency } from ".";
import { AccountingTypes } from "./accounting-types";
import { MongoTypes } from "./mongo-types";

export namespace RecurrentExpenseTypes {
  export interface IReccurentExpensesService {
    addRecurrentExpenses(
      recurrentExpenses: RecurrentExpense[]
    ): Promise<string[]>;
    getRecurrentExpenses(recurrence: Recurrence): Promise<RecurrentExpense[]>;

    getRecurrentExpensesByAccount(
      accountId: string
    ): Promise<RecurrentExpense[]>;
    getRecurrentExpense(id: string): Promise<RecurrentExpense>;
    updateRecurrentExpense(recurrentExpense: RecurrentExpense): Promise<void>;
    removeRecurrentExpense(id: string): Promise<void>;
  }
  export interface IReccurentExpensesRepository
    extends MongoTypes.Repository<RecurrentExpense, EditRecurrentExpense> {
    addRecurrentExpenses(recurrentExpenses: RecurrentExpense[]): Promise<void>;
    getRecurrentExpenses(recurrence: Recurrence): Promise<RecurrentExpense[]>;

    getRecurrentExpensesByAccount(
      accountId: string
    ): Promise<RecurrentExpense[]>;
    getRecurrentExpense(id: string): Promise<RecurrentExpense>;
    updateRecurrentExpense(recurrentExpense: RecurrentExpense): Promise<void>;
    removeRecurrentExpense(id: string): Promise<void>;
  }

  export interface RecurrentExpense extends IEntityDetails {
    id?: string;
    accountId: string;
    category: AccountingTypes.ExpenseCategory;
    name: string;
    type: AccountingTypes.ExpenseType;
    description?: string;
    amount: number;
    currency: Currency;
    dueDay: number;
    recurrence: Recurrence;
  }

  export interface EditRecurrentExpense {
    category?: AccountingTypes.ExpenseCategory;
    name?: string;
    amount?: number;
    currency?: Currency;
    type?: AccountingTypes.ExpenseType;
    description?: string;
    timestamp?: Date;
    deleted?: boolean;
  }

  export enum Recurrence {
    Monthly = "monthly",
    Semesterly = "semesterly",
    Quarterly = "quarterly",
    Medianly = "medianly",
  }
}
