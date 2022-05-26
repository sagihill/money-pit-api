import { AccountingTypes } from ".";

export namespace ExpenseProcessorTypes {
  export interface IExpenseProcessor {
    run(): Promise<void>;
  }

  export type ExpenseExtract = {
    category: AccountingTypes.ExpenseCategory;
    name: string;
    amount: number;
    type: AccountingTypes.ExpenseType;
    timestamp: Date;
    description?: string;
  };

  export type CategoryMap = { [key: string]: AccountingTypes.ExpenseCategory };
}
