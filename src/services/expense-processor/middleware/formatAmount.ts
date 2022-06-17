import { Middleware } from "../../../middleware/entities-middleware";
import { ExpenseProcessorTypes } from "../../../types";

export const formatAmount: Middleware.IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  expense.amount = Math.round(expense.amount * 100);
  return expense;
};
