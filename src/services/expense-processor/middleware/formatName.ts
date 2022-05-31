import { IMiddleware } from "../../../lib";
import { ExpenseProcessorTypes } from "../../../types";

export const formatName: IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  let formatted = options?.expenseNameFormatConfig[expense.name];

  switch (expense.name) {
    case `העברה ב BIT בנה"פ`:
      formatted = "Bit - העברה ב";
      break;
    case `חברת פרטנר תקשורת בע"מ (ה`:
      formatted = "פרטנר";
      break;
    case `שרותי בריאות כללית הו"ק`:
      formatted = "כללית";
      break;
    default:
      break;
  }

  expense.name = formatted ?? expense.name;
  return expense;
};
