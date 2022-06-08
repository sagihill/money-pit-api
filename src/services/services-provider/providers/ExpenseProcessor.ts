import { AccountingTypes, ExpenseProcessorTypes } from "../../../types";
import { AccountingService, getAccountingRepository } from "../../accounting";
import {
  getProcessorLogsRepository,
  ExpenseProcessor as ExpenseProcessorService,
} from "../../expense-processor";
import { ServicesProvider } from "../services-provider";

export default async function ExpenseProcessor(
  options: any,
  SP: ServicesProvider
): Promise<ExpenseProcessorTypes.IExpenseProcessor> {
  const logger = await SP.Logger();
  const accountingService = await SP.Accounting();
  const accountService = await SP.Account();
  const config = await SP.Config();
  const configuration: ExpenseProcessorTypes.ExpenseProcessorOptions = {
    expenseCategoryCategoryMap: await config.getObject(
      "EXPENSE_CATEGORY_CATEGORY_MAP"
    ),
    expenseCategoryNameMap: await config.getObject("EXPENSE_CATEGORY_NAME_MAP"),
    expenseNameFormatConfig: await config.getObject(
      "EXPENSE_NAME_FORMAT_CONFIG"
    ),
    expenseSheetsPath: "../../expense-sheets",
    skipAllreadyProcessed: await config.getBool(
      "SKIP_ALLREADY_PROCESSED_SHEETS"
    ),
    ...options,
  };
  const logsRepo = getProcessorLogsRepository(logger);
  const expenseProcessor = new ExpenseProcessorService(
    accountingService,
    accountService,
    logsRepo,
    configuration,
    logger
  );
  return expenseProcessor;
}
