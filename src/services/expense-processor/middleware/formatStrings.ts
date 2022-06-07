import { IMiddleware } from "../../../lib";
import { ExpenseProcessorTypes } from "../../../types";

export const formatStrings: IMiddleware<
  ExpenseProcessorTypes.ExpenseExtract,
  ExpenseProcessorTypes.ExpenseProcessorOptions
> = (
  expense: ExpenseProcessorTypes.ExpenseExtract,
  options?: ExpenseProcessorTypes.ExpenseProcessorOptions
) => {
  function _formatString(sentence?: string): string | undefined {
    if (!sentence) {
      return;
    }
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

  expense.description = _formatString(expense.description);

  return expense;
};
