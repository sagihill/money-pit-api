import { Credentials } from ".";

export namespace ExpenseSheetsTypes {
  export interface IExpenseSheets {
    run(params: ExpesnseSheetsParams): Promise<void>;
  }

  export type ExpesnseSheetsParams = {
    accountId: string;
    creditProviderWebsiteUrl: string;
    credentials: Credentials;
  };

  export type ExpenseSheetsOptions = {
    expenseSheetsPath: string;
  };
}
