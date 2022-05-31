import { AccountingTypes, Currency } from ".";

export namespace ExpenseProcessorTypes {
  export interface IExpenseProcessor {
    run(params: { accountId: string }): Promise<void>;
  }
  export interface IProcessorLogsRepository {
    add(log: ProcessorLog): Promise<void>;
    isAllreadyProcessed(fileID: string): Promise<boolean>;
  }

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
