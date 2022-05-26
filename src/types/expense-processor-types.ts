import { AccountingTypes, Currency } from ".";

export namespace ExpenseProcessorTypes {
  export interface IExpenseProcessor {
    run(params: { accountId: string }): Promise<void>;
  }

  export type ExpenseProcessorOptions = {
    expenseCategoryCategoryMap: CategoryMap;
    expenseCategoryNameMap: CategoryMap;
    expenseSheetsPath: string;
  };

  export type ExpenseExtract = {
    id: string;
    category: AccountingTypes.ExpenseCategory;
    name: string;
    amount: number;
    type: AccountingTypes.ExpenseType;
    timestamp: Date;
    description?: string;
    currency: Currency;
    accountId: string;
  };

  export type CategoryMap = { [key: string]: AccountingTypes.ExpenseCategory };
}
