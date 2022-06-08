import { ExpenseSheetsDownloaderTypes } from "../../../types";
import { ExpenseSheetsDownloader as ExpenseSheetsDownloaderService } from "../../expense-sheets-downloader";
import { ServicesProvider } from "../services-provider";

export default async function ExpenseSheetsDownloader(
  options: any,
  SP: ServicesProvider
): Promise<ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader> {
  const logger = await SP.Logger();
  const configuration: ExpenseSheetsDownloaderTypes.ExpenseSheetsOptions = {
    expenseSheetsPath: "../../expense-sheets",
    ...options,
  };
  const expenseSheetsDownloader = new ExpenseSheetsDownloaderService(
    configuration,
    logger
  );

  return expenseSheetsDownloader;
}
