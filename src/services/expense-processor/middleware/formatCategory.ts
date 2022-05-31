import { IMiddleware } from "../../../lib";
import { AccountingTypes, ExpenseProcessorTypes } from "../../../types";

export const formatCategory: IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  const categoryFromName = options?.expenseCategoryNameMap[expense.name];
  const categoryFromCategory =
    options?.expenseCategoryCategoryMap[expense.category];
  if (categoryFromName) {
    expense.category = categoryFromName;
  } else if (categoryFromCategory) {
    expense.category = categoryFromCategory;
  } else {
    expense.category = AccountingTypes.ExpenseCategory.Other;
  }

  return expense;
};
