import {
  AccountingTypes,
  Currency,
  ExpenseProcessorTypes,
  LoggerTypes,
} from "../../types";

import xlsx from "node-xlsx";
import * as fs from "fs";
import * as path from "path";
import { FS, ID } from "../../lib";
import { UsingMiddleware } from "../../lib";
import { formatName, formatStrings, formatCategory } from "./middleware";
export class ExpenseProcessor
  extends UsingMiddleware<
    ExpenseProcessorTypes.ExpenseExtract,
    ExpenseProcessorTypes.ExpenseProcessorOptions
  >
  implements ExpenseProcessorTypes.IExpenseProcessor
{
  private expenseTypeMap: { [key: string]: AccountingTypes.ExpenseType } = {
    תשלומים: AccountingTypes.ExpenseType.Installments,
    רגילה: AccountingTypes.ExpenseType.Regular,
    "חיוב חודשי": AccountingTypes.ExpenseType.Subscription,
    "חיוב עסקות מיידי": AccountingTypes.ExpenseType.Regular,
  };
  private expenseCurrencyMap: { [key: string]: Currency } = {
    "₪": Currency.ILS,
  };

  constructor(
    private readonly accountingService: AccountingTypes.IAccountingService,
    private readonly logsRepo: ExpenseProcessorTypes.IProcessorLogsRepository,
    private readonly options: ExpenseProcessorTypes.ExpenseProcessorOptions,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super();

    this.use(formatName);
    this.use(formatCategory);
    this.use(formatStrings);
  }

  async run(params: { accountId: string }): Promise<void> {
    // Get path to files directory
    const filesDirPath = path.resolve(
      __dirname,
      `${this.options.expenseSheetsPath}/processing/${params.accountId}`
    );

    FS.createDirIfNotExists(filesDirPath);

    // Get an array of the files inside the folder
    const files = fs.readdirSync(filesDirPath);

    // Loop through each file that was retrieved and process
    for await (const file of files) {
      if (!fs.lstatSync(filesDirPath + `/${file}`).isDirectory()) {
        await this.processFile(filesDirPath, file, params.accountId);
      }
    }
  }

  private async processFile(
    dirPath: string,
    fileName: string,
    accountId: string
  ): Promise<void> {
    const filePath = path.join(dirPath, `/${fileName}`);

    const file = fs.readFileSync(filePath);

    const workSheets = xlsx.parse(file) as unknown as {
      name: string;
      data: string[][];
    }[];

    const billingDateTransactions: string[][] = workSheets[0].data.slice(4);
    const fileId = ID.get(billingDateTransactions.toString());

    const isAllreadyProcessed = await this.logsRepo.isAllreadyProcessed(fileId);

    if (isAllreadyProcessed && this.options.skipAllreadyProcessed) {
      this.logger.info(
        `Skip processing file_${fileId}. this file was allready processed.`
      );
      fs.rmSync(filePath);
      return;
    }

    const expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[] = [];
    for await (const expenseData of billingDateTransactions) {
      const expenseExtract = await this.getExpenseExtract(
        expenseData,
        accountId
      );

      expensesExtracts.push(expenseExtract);
    }
    await this.addExpenses(expensesExtracts);

    await this.postProcess(filePath, fileId, accountId);
  }

  private async postProcess(
    filePath: string,
    fileId: string,
    accountId: string
  ): Promise<void> {
    const newDirPath = path.join(
      __dirname,
      `${this.options.expenseSheetsPath}/processed/${accountId}`
    );
    FS.createDirIfNotExists(newDirPath);
    const newFilePath = path.join(newDirPath, `/processed_${fileId}.xlsx`);

    fs.rename(filePath, newFilePath, (err) =>
      err ? this.logger.error(err?.message) : null
    );

    await this.logsRepo.add({ fileId: fileId, processedAt: new Date() });
  }

  private async addExpenses(
    expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[]
  ): Promise<void> {
    const expenses = expensesExtracts.map((expenseExtract) => {
      return this.accountingService.createNewExpense({
        ...(expenseExtract as AccountingTypes.AddExpenseRequest),
      });
    });

    await this.accountingService.addExpensesFromExtract(expenses);
  }

  private async getExpenseExtract(
    expenseData: string[],
    accountId: string
  ): Promise<ExpenseProcessorTypes.ExpenseExtract> {
    const name = expenseData[1];
    const category = expenseData[2];
    const amount = Number(expenseData[5]);
    const description = expenseData[10];
    const type = this.expenseTypeMap[expenseData[4]];
    const currency = this.expenseCurrencyMap[expenseData[6]];
    const timestamp = this.getDate(expenseData[0]);
    const chargeDate = !!expenseData[9]
      ? this.getDate(expenseData[9])
      : undefined;
    let expenseExtract: ExpenseProcessorTypes.ExpenseExtract = {
      name,
      category,
      amount,
      description,
      type,
      currency,
      accountId,
      timestamp,
      chargeDate,
    };

    expenseExtract = this.runMiddleware(expenseExtract, this.options);

    expenseExtract.id = ID.get(
      [
        expenseExtract.name,
        expenseExtract.category,
        expenseExtract.amount,
        expenseExtract.description,
        expenseExtract.type,
        expenseExtract.currency,
        expenseExtract.accountId,
        expenseExtract.timestamp,
      ].join("")
    );

    return expenseExtract;
  }

  private getDate(dateString: string): Date {
    const dateParsed = dateString.split("-");

    const date = new Date(
      Number(dateParsed[2]),
      Number(dateParsed[1]) - 1,
      Number(dateParsed[0]) + 1
    );

    return date;
  }
}
