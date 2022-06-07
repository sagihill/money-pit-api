import { IMiddleware, Utils } from "../../../lib";
import { AccountingTypes, ExpenseProcessorTypes } from "../../../types";

export const formatCategory: IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  if (
    Object.values(AccountingTypes.ExpenseCategory).includes(
      expense.category as AccountingTypes.ExpenseCategory
    )
  ) {
    return expense;
  }

  const categoryNameMap = options?.expenseCategoryNameMap as {
    [key: string]: string;
  };

  const categoryCategoryMap = options?.expenseCategoryCategoryMap as {
    [key: string]: string;
  };

  let category: string | undefined = categoryNameMap[expense.name];

  if (!category) {
    category = Utils.searchMap(expense.name, categoryNameMap);
  }

  if (!category) {
    category = categoryCategoryMap[expense.category];
  }

  if (!category) {
    category = Utils.searchMap(expense.category, categoryCategoryMap);
  }

  expense.category = category ?? AccountingTypes.ExpenseCategory.Other;

  return expense;
};
