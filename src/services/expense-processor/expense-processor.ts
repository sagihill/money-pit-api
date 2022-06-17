import xlsx from "node-xlsx";
import * as fs from "fs";
import * as path from "path";
import {
  AccountingTypes,
  AccountTypes,
  DomainTypes,
  ExpenseProcessorTypes,
  LoggerTypes,
  RecurrentExpenseTypes,
} from "../../types";
import { FS, ID } from "../../lib";
import { Middleware } from "../../middleware/entities-middleware";
import { formatName, formatCategory, formatAmount } from "./middleware";

export class ExpenseProcessor
  extends Middleware.UsingMiddleware<
    ExpenseProcessorTypes.ExpenseExtract,
    ExpenseProcessorTypes.ExpenseProcessorOptions
  >
  implements ExpenseProcessorTypes.IExpenseProcessor
{
  constructor(
    private readonly accountingService: AccountingTypes.IAccountingService,
    private readonly accountService: AccountTypes.IAccountReaderService,
    private readonly logsRepo: ExpenseProcessorTypes.IProcessorLogsRepository,
    private readonly options: ExpenseProcessorTypes.ExpenseProcessorOptions,
    private readonly logger: LoggerTypes.ILogger
  ) {
    super();

    this.use(formatName);
    this.use(formatCategory);
    this.use(formatAmount);
  }

  async processRecurrentExpenses(
    params: ExpenseProcessorTypes.ExpenseProcessorReccurentParams
  ): Promise<void> {
    if (!params.recurrentExpenses?.length) {
      return;
    }

    const transactionSheet = this.createSheet(params.recurrentExpenses);

    const expenseExtracts = await this.processSheet(
      transactionSheet,
      params.accountId
    );

    await this.addExpenses(expenseExtracts);
  }

  private createSheet(
    recurrentExpenses: RecurrentExpenseTypes.RecurrentExpense[]
  ): string[][] {
    const transactionSheet: string[][] = [];
    recurrentExpenses.forEach((recurrentExpense) => {
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const timestamp = `${recurrentExpense.dueDay}-${month}-${year}`;

      const transaction = [
        timestamp,
        recurrentExpense.name.toString(),
        recurrentExpense.category.toString(),
        "",
        recurrentExpense.type.toString(),
        recurrentExpense.amount.toString(),
        recurrentExpense.currency.toString(),
        "",
        "",
        "",
        recurrentExpense.description ?? "",
      ];

      transactionSheet.push(transaction);
    });

    return transactionSheet;
  }

  async processExpenseDownload(
    params: ExpenseProcessorTypes.ExpenseProcessorParams
  ): Promise<void> {
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
      if (!fs.lstatSync(`${filesDirPath}/${file}`).isDirectory()) {
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
    const sheets = await this.getSheets(filePath);

    const fileId = ID.get(
      [
        sheets.billingDateTransactions?.toString(),
        sheets.notProcessedYetTransactions?.toString(),
        sheets.foreignTransactions?.toString(),
        sheets.immediateTransactions?.toString(),
      ].join("")
    );

    const isAllreadyProcessed = await this.logsRepo.isAllreadyProcessed(fileId);

    if (isAllreadyProcessed && this.options.skipAllreadyProcessed) {
      this.logger.info(
        `Skip processing file_${fileId}. this file was allready processed.`
      );
      fs.rmSync(filePath);
      return;
    }

    const expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[] = [];
    expensesExtracts.push(
      ...(await this.processSheet(
        sheets.billingDateTransactions,
        accountId,
        false
      )),
      ...(await this.processSheet(
        sheets.notProcessedYetTransactions,
        accountId,
        true
      )),
      ...(await this.processSheet(
        sheets.foreignTransactions,
        accountId,
        false
      )),
      ...(await this.processSheet(
        sheets.immediateTransactions,
        accountId,
        false
      ))
    );

    await this.addExpenses(expensesExtracts);

    await this.postProcess(filePath, fileId, accountId);
  }

  private getSheets(filePath: string) {
    const file = fs.readFileSync(filePath);

    const transactionsSheets = xlsx.parse(file) as unknown as {
      name: string;
      data: string[][];
    }[];

    const billingDateTransactions: string[][] =
      transactionsSheets[0]?.data.slice(4);

    const notProcessedYetTransactions: string[][] =
      transactionsSheets[1]?.data.slice(4);

    const foreignTransactions: string[][] =
      transactionsSheets[2]?.data.slice(4);
    const immediateTransactions: string[][] =
      transactionsSheets[3]?.data.slice(4);

    return {
      billingDateTransactions,
      notProcessedYetTransactions,
      foreignTransactions,
      immediateTransactions,
    };
  }

  private async processSheet(
    transactionsSheet: string[][],
    accountId: string,
    isNotProcessedYet: boolean = false
  ): Promise<ExpenseProcessorTypes.ExpenseExtract[]> {
    if (!transactionsSheet) {
      return [];
    }
    const expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[] = [];
    for await (const expenseData of transactionsSheet) {
      if (!expenseData[0]) {
        continue;
      }
      const expenseExtract = await this.getExpenseExtract(
        expenseData,
        accountId,
        isNotProcessedYet
      );

      if (expenseExtract) {
        expensesExtracts.push(expenseExtract);
      }
    }

    return expensesExtracts;
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

    if (this.options.skipAllreadyProcessed) {
      await this.logsRepo.add({ fileId, processedAt: new Date() });
    }
  }

  private async addExpenses(
    expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[]
  ): Promise<void> {
    const expenses = [];
    for await (const expenseExtract of expensesExtracts) {
      const expense = await this.accountingService.createNewExpense({
        ...(expenseExtract as AccountingTypes.Requests.AddRequest),
      });

      expenses.push(expense);
    }

    await this.accountingService.addExpenses(expenses);
  }

  private async getExpenseExtract(
    expenseData: string[],
    accountId: string,
    isNotProcessedYet: boolean
  ): Promise<ExpenseProcessorTypes.ExpenseExtract | undefined> {
    const type = this.getType(expenseData[4]);
    if (
      isNotProcessedYet &&
      type === AccountingTypes.ExpenseType.Installments
    ) {
      return;
    }

    const amount = isNotProcessedYet
      ? Number(expenseData[7])
      : Number(expenseData[5]);
    const name = expenseData[1];
    const category = expenseData[2];
    const description = expenseData[10];
    const currency = this.getCurrency(
      isNotProcessedYet ? expenseData[8] : expenseData[6]
    );

    const timestamp = this.getDate(expenseData[0]);
    const chargeDate = expenseData[9]
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

  private getType(string: string): AccountingTypes.ExpenseType {
    const expenseTypeMap: { [key: string]: AccountingTypes.ExpenseType } = {
      תשלומים: AccountingTypes.ExpenseType.Installments,
      רגילה: AccountingTypes.ExpenseType.Regular,
      "חיוב חודשי": AccountingTypes.ExpenseType.Subscription,
      "חיוב עסקות מיידי": AccountingTypes.ExpenseType.Regular,
    };

    if (
      Object.values(AccountingTypes.ExpenseType).includes(
        string as AccountingTypes.ExpenseType
      )
    ) {
      return string as AccountingTypes.ExpenseType;
    }
    return expenseTypeMap[string];
  }

  private getCurrency(string: string): DomainTypes.Currency {
    const expenseCurrencyMap: { [key: string]: DomainTypes.Currency } = {
      "₪": DomainTypes.Currency.ILS,
    };

    if (
      Object.values(DomainTypes.Currency).includes(
        string as DomainTypes.Currency
      )
    ) {
      return string as DomainTypes.Currency;
    }
    return expenseCurrencyMap[string];
  }
}
