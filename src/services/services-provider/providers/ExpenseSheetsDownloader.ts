import { ExpenseSheetsDownloaderTypes } from "../../../types";
import { ExpenseSheetsDownloader as ExpenseSheetsDownloaderService } from "../../expense-sheets-downloader";
import { ServicesProvider } from "../services-provider";

export default async function ExpenseSheetsDownloader(
  options: any,
  SP: ServicesProvider
): Promise<ExpenseSheetsDownloaderTypes.IExpenseSheetsDownloader> {
  const logger = await SP.Logger();
  const config = await SP.Config();
  const configuration: ExpenseSheetsDownloaderTypes.ExpenseSheetsOptions = {
    isLocal: await config.getBool("LOCAL"),
    expenseSheetsPath:
      (await config.get("EXPENSE_SHEETS_PATH")) ?? "../../expense-sheets",
    ...options,
  };
  const expenseSheetsDownloader = new ExpenseSheetsDownloaderService(
    configuration,
    logger
  );

  return expenseSheetsDownloader;
}
