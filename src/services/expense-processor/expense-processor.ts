import {
  AccountingTypes,
  ExpenseProcessorTypes,
  LoggerTypes,
} from "../../types";

import xlsx from "node-xlsx";
import * as fs from "fs";
import * as path from "path";
import { default as moment } from "moment";

// const { csv } = require("csv-parser");

export class ExpenseProcessor
  implements ExpenseProcessorTypes.IExpenseProcessor
{
  private expenseTypeMap: { [key: string]: AccountingTypes.ExpenseType } = {
    תשלומים: AccountingTypes.ExpenseType.Installments,
    רגילה: AccountingTypes.ExpenseType.Regular,
  };

  private expenseCategoryMap: {
    [key: string]: AccountingTypes.ExpenseCategory;
  } = {
    ביטוח: AccountingTypes.ExpenseCategory.Insurance,
    "מזון וצריכה": AccountingTypes.ExpenseCategory.FoodAndConsumption,
    "שירותי תקשורת": AccountingTypes.ExpenseCategory.CommunicationServices,
    "מחשבים, תוכנות וחשמל":
      AccountingTypes.ExpenseCategory.CommunicationServices,
  };

  constructor(
    private readonly accountingService: AccountingTypes.IAccountingService,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async run(): Promise<void> {
    this.preProcess();
    const workSheets = xlsx.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../../public/expense-sheets/expense_sheet_01.xlsx"
        )
      )
    ) as unknown as { name: string; data: string[][] }[];

    const billingDateTransactions: string[][] = workSheets[0].data.slice(4);

    billingDateTransactions.forEach(async (expenseData: string[]) => {
      const expenseExtract = await this.getExpenseExtract(expenseData);
      console.log(expenseExtract);
    });

    this.postProcess();
  }

  private preProcess() {
    // Get path to image directory
    const filesDirPath = path.resolve(__dirname, "../../public/expense-sheets");

    // Get an array of the files inside the folder
    const files = fs.readdirSync(filesDirPath);

    // Loop through each file that was retrieved
    files.forEach((file, index) => {
      if (!fs.lstatSync(filesDirPath + `/${file}`).isDirectory()) {
        fs.rename(
          filesDirPath + `/${file}`,
          filesDirPath + `/expense_sheet_0${index + 1}.xlsx`,
          (err) => console.log(err)
        );
      }
    });
  }

  private postProcess() {}

  private async getExpenseExtract(
    expenseData: string[]
  ): Promise<ExpenseProcessorTypes.ExpenseExtract> {
    return {
      timestamp: this.getDate(expenseData[0]),
      name: this.formatString(expenseData[1]),
      category: await this.getCategory(
        expenseData,
        this.expenseCategoryMap,
        this.expenseCategoryMap
      ),
      amount: Number(expenseData[5]),
      description: !!expenseData[10]
        ? this.formatString(expenseData[10])
        : undefined,
      type:
        this.expenseTypeMap[expenseData[4]] ??
        this.formatString(expenseData[4]),
    };
  }

  private async getCategory(
    expenseData: string[],
    categoryMap: ExpenseProcessorTypes.CategoryMap,
    categoryNameMap: ExpenseProcessorTypes.CategoryMap
  ): Promise<AccountingTypes.ExpenseCategory> {
    const categoryFromName = categoryNameMap[expenseData[1]];
    const categoryFromCategory = categoryMap[expenseData[2]];
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
