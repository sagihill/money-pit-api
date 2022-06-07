import { MongoRepository } from "../../lib/repository";
import RecurrentExpense from "../../models/RecurrentExpense";
import { RecurrentExpenseTypes } from "../../types";

export const getReccurentExpensesRepository = () => {
  return new ReccurentExpensesRepository(RecurrentExpense);
};

class ReccurentExpensesRepository
  extends MongoRepository<
    RecurrentExpenseTypes.RecurrentExpense,
    RecurrentExpenseTypes.EditRecurrentExpense
  >
  implements RecurrentExpenseTypes.IReccurentExpensesRepository
{
  getRecurrentExpensesByAccount(
    accountId: string
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    throw new Error("Method not implemented.");
  }
  getRecurrentExpense(
    id: string
  ): Promise<RecurrentExpenseTypes.RecurrentExpense> {
    throw new Error("Method not implemented.");
  }
  updateRecurrentExpense(
    recurrentExpense: RecurrentExpenseTypes.RecurrentExpense
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeRecurrentExpense(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addRecurrentExpenses(
    recurrentExpenses: RecurrentExpenseTypes.RecurrentExpense[]
  ): Promise<void> {
    await this.addMany(recurrentExpenses);
  }

  async getRecurrentExpenses(
    recurrence: RecurrentExpenseTypes.Recurrence
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    const expenses = await this.model.find({ deleted: false, recurrence });
    return expenses;
  }
}
