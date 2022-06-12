import {
  AccountingTypes,
  CriticalError,
  Currency,
  IEntityDetails,
  ISimpleService,
} from ".";

// tslint:disable-next-line: no-namespace
export namespace RecurrentExpenseTypes {
  export interface IReccurentExpensesService
    extends ISimpleService<
      RecurrentExpense,
      Requests.AddRequest,
      Requests.UpdateRequest
    > {
    addRecurrentExpenses(
      requests: Requests.AddRequest[]
    ): Promise<RecurrentExpense[]>;
    findRecurrentExpenses(
      request: Requests.FindRequest
    ): Promise<RecurrentExpense[]>;
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

  export enum Recurrence {
    Monthly = "monthly",
    Semesterly = "semesterly",
    Quarterly = "quarterly",
    Medianly = "medianly",
  }

  export class InvalidRecurrence extends CriticalError {
    constructor(protected readonly recurrnece: Recurrence) {
      super(
        `Can't finish operation. recurrnece ${recurrnece} is an invalid value.`
      );
    }
  }

  export namespace Requests {
    export interface AddRequest {
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
    export interface UpdateRequest {
      category?: AccountingTypes.ExpenseCategory;
      name?: string;
      type?: AccountingTypes.ExpenseType;
      description?: string;
      amount?: number;
      currency?: Currency;
      dueDay?: number;
      recurrence?: Recurrence;
    }

    export interface FindRequest {
      recurrence?: Recurrence;
      accountId?: string;
    }
  }
}
