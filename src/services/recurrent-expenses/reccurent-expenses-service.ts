import { ID } from "../../lib";
import { RecurrentExpenseTypes, LoggerTypes } from "../../types";

export class ReccurentExpensesService
  implements RecurrentExpenseTypes.IReccurentExpensesService
{
  constructor(
    private readonly repository: RecurrentExpenseTypes.IReccurentExpensesRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

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
  ): Promise<string[]> {
    const recurrentExpensesIds = [];
    for await (const recurrentExpense of recurrentExpenses) {
      const id = ID.get();
      recurrentExpense.id = id;
      recurrentExpensesIds.push(id);
    }
    await this.repository.addRecurrentExpenses(recurrentExpenses);
    return recurrentExpensesIds;
  }

  async getRecurrentExpenses(
    recurrence: RecurrentExpenseTypes.Recurrence
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    const expenses = await this.repository.getRecurrentExpenses(recurrence);
    return expenses;
  }
}
