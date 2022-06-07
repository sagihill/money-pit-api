import { Credentials } from ".";

export namespace ExpenseSheetsDownloaderTypes {
  export interface IExpenseSheetsDownloader {
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
