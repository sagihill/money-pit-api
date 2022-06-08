import { AccountingTypes, Currency } from ".";
import { RecurrentExpenseTypes } from "./recurrent-expense-types";

export namespace ExpenseProcessorTypes {
  export interface IExpenseProcessor {
    processExpenseDownload(params: ExpenseProcessorParams): Promise<void>;
    processRecurrentExpenses(params: ExpenseProcessorParams): Promise<void>;
  }
  export interface IProcessorLogsRepository {
    add(log: ProcessorLog): Promise<void>;
    isAllreadyProcessed(fileID: string): Promise<boolean>;
  }

  export type ExpenseProcessorParams = { accountId: string };
  export type ExpenseProcessorReccurentParams = {
    accountId: string;
    recurrentExpenses: RecurrentExpenseTypes.RecurrentExpense[];
  };

  export type ExpenseProcessorOptions = {
    expenseCategoryCategoryMap: CategoryMap;
    expenseCategoryNameMap: CategoryMap;
    expenseNameFormatConfig: { [key: string]: string };
    expenseSheetsPath: string;
    skipAllreadyProcessed: boolean;
  };

  export type ExpenseExtract = {
    id?: string;
    category: string;
    name: string;
    amount: number;
    type: AccountingTypes.ExpenseType;
    timestamp: Date;
    description?: string;
    chargeDate?: Date;
    currency: Currency;
    accountId: string;
  };

  export type CategoryMap = { [key: string]: AccountingTypes.ExpenseCategory };

  export type ProcessorLog = {
    fileId: string;
    processedAt: Date;
  };
}
