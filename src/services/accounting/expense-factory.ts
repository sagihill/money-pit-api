import { ID } from "../../lib/common";
import { AccountingTypes } from "../../types";

export function createNewExpense(
  request: AccountingTypes.AddExpenseRequest
): AccountingTypes.Expense {
  const now = new Date();
  const expense: AccountingTypes.Expense = {
    ...request,
    id: request.id ?? ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return expense;
}
