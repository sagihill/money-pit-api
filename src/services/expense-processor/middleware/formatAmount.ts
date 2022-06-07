import { IMiddleware } from "../../../lib";
import { ExpenseProcessorTypes } from "../../../types";

export const formatAmount: IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  expense.amount = Math.round(expense.amount * 100);
  return expense;
};
