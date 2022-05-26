import {
  AccountingTypes,
  Currency,
  ExpenseProcessorTypes,
  LoggerTypes,
} from "../../types";

import xlsx from "node-xlsx";
import * as fs from "fs";
import * as path from "path";
import { ID } from "../../lib/common";
export class ExpenseProcessor
  implements ExpenseProcessorTypes.IExpenseProcessor
{
  private expenseTypeMap: { [key: string]: AccountingTypes.ExpenseType } = {
    תשלומים: AccountingTypes.ExpenseType.Installments,
    רגילה: AccountingTypes.ExpenseType.Regular,
  };
  private expenseCurrencyMap: { [key: string]: Currency } = {
    "₪": Currency.ILS,
  };

  constructor(
    private readonly accountingService: AccountingTypes.IAccountingService,
    private readonly options: ExpenseProcessorTypes.ExpenseProcessorOptions,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async run(params: { accountId: string }): Promise<void> {
    // Get path to files directory
    const filesDirPath = path.resolve(__dirname, "../../public/expense-sheets");

    // Get an array of the files inside the folder
    const files = fs.readdirSync(filesDirPath);

    // Loop through each file that was retrieved and process
    for await (const file of files) {
      if (!fs.lstatSync(filesDirPath + `/${file}`).isDirectory()) {
        await this.processFile(`/${file}`, params.accountId);
      }
    }
  }

  private async processFile(
    fileName: string,
    accountId: string
  ): Promise<void> {
    const filePath = path.join(
      __dirname,
      `${this.options.expenseSheetsPath}${fileName}`
    );

    const file = fs.readFileSync(filePath);

    const workSheets = xlsx.parse(file) as unknown as {
      name: string;
      data: string[][];
    }[];

    const fileId = ID.get(file.toString());

    const billingDateTransactions: string[][] = workSheets[0].data.slice(4);
    const expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[] = [];
    for await (const expenseData of billingDateTransactions) {
      const expenseExtract = await this.getExpenseExtract(
        expenseData,
        accountId
      );
      expensesExtracts.push(expenseExtract);
    }
    await this.addExpenses(expensesExtracts);

    this.postProcess(filePath, fileId);
  }

  private preProcess() {}

  private postProcess(filePath: string, fileId: string): void {
    const newPath = path.join(
      __dirname,
      `${this.options.expenseSheetsPath}/processed/processed_${fileId}.xlsx`
    );
    fs.rename(filePath, newPath, (err) =>
      err ? this.logger.error(err?.message) : null
    );
  }

  private async addExpenses(
    expensesExtracts: ExpenseProcessorTypes.ExpenseExtract[]
  ): Promise<void> {
    const expenses = expensesExtracts.map((expenseExtract) => {
      return this.accountingService.createNewExpense({
        ...expenseExtract,
      });
    });

    await this.accountingService.addExpensesFromExtract(expenses);
  }

  private async getExpenseExtract(
    expenseData: string[],
    accountId: string
  ): Promise<ExpenseProcessorTypes.ExpenseExtract> {
    return {
      id: ID.get(expenseData.join("")),
      timestamp: this.getDate(expenseData[0]),
      name: expenseData[1],
      category: await this.getCategory(expenseData),
      amount: Number(expenseData[5]),
      description: !!expenseData[10]
        ? this.formatString(expenseData[10])
        : undefined,
      type:
        this.expenseTypeMap[expenseData[4]] ??
        this.formatString(expenseData[4]),
      currency: this.expenseCurrencyMap[expenseData[6]],
      accountId,
    };
  }

  private async getCategory(
    expenseData: string[]
  ): Promise<AccountingTypes.ExpenseCategory> {
    const categoryFromName =
      this.options.expenseCategoryNameMap[expenseData[1]];
    const categoryFromCategory =
      this.options.expenseCategoryCategoryMap[expenseData[2]];
    if (categoryFromName) {
      return categoryFromName;
    } else if (categoryFromCategory) {
      return categoryFromCategory;
    } else {
      return AccountingTypes.ExpenseCategory.Other;
    }
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

  private formatString(sentence: string): string {
    const words = sentence.split(" ");
    const reversed = words.map((word) => {
      if (/[\u0590-\u05FF]/.test(word)) {
        return word.split("").reverse().join("");
      } else {
        return word;
      }
    });

    return reversed.reverse().join(" ");
  }
}
