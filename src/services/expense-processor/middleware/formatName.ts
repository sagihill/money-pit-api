import { Utils } from "../../../lib";
import { Middleware } from "../../../middleware/entities-middleware";
import { ExpenseProcessorTypes } from "../../../types";

export const formatName: Middleware.IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  const map = options?.expenseNameFormatConfig as { [key: string]: string };
  let formatted = options?.expenseNameFormatConfig[expense.name];

  if (!formatted) {
    formatted = Utils.searchMap(expense.name, map);
  }

  expense.name = formatted ?? expense.name;
  return expense;
};
