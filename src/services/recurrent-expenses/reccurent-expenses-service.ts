import { ID } from "../../lib";
import { RecurrentExpenseTypes, LoggerTypes } from "../../types";

export class ReccurentExpensesService
  implements RecurrentExpenseTypes.IReccurentExpensesService
{
  constructor(
    private readonly repository: RecurrentExpenseTypes.IReccurentExpensesRepository,
    private readonly logger: LoggerTypes.ILogger
  ) {}

  async getRecurrentExpensesByAccount(
    accountId: string
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    try {
      this.logger.info(
        `running getRecurrentExpensesByAccount in ReccurentExpensesService for account_${accountId}`
      );
      const expenses = await this.repository.getRecurrentExpensesByAccount(
        accountId
      );
      return expenses;
    } catch (error) {
      this.logger.info(
        `error on getRecurrentExpensesByAccount in ReccurentExpensesService for account_${accountId}`
      );
      throw error;
    }
  }
  async getRecurrentExpense(
    id: string
  ): Promise<RecurrentExpenseTypes.RecurrentExpense> {
    const expense = await this.repository.getRecurrentExpense(id);
    return expense;
  }
  async updateRecurrentExpense(
    recurrentExpense: RecurrentExpenseTypes.RecurrentExpense
  ): Promise<void> {
    await this.updateRecurrentExpense(recurrentExpense);
  }
  async removeRecurrentExpense(id: string): Promise<void> {
    await this.removeRecurrentExpense(id);
  }

  async addRecurrentExpenses(
    recurrentExpenses: RecurrentExpenseTypes.RecurrentExpense[]
  ): Promise<string[]> {
    const recurrentExpensesIds = [];
    const recurrentExpensesToAdd = [];
    const now = new Date();
    for await (let recurrentExpense of recurrentExpenses) {
      const id = ID.get();
      recurrentExpense = {
        ...recurrentExpense,
        id,
        deleted: false,
        createdAt: now,
        updatedAt: now,
      };
      recurrentExpensesToAdd.push(recurrentExpense);
      recurrentExpensesIds.push(id);
    }
    await this.repository.addRecurrentExpenses(recurrentExpensesToAdd);
    return recurrentExpensesIds;
  }

  async getRecurrentExpenses(
    recurrence: RecurrentExpenseTypes.Recurrence
  ): Promise<RecurrentExpenseTypes.RecurrentExpense[]> {
    try {
      this.logger.info(
        `running getRecurrentExpenses in ReccurentExpensesService for ${recurrence} recurrence`
      );
      const expenses = await this.repository.getRecurrentExpenses(recurrence);
      return expenses;
    } catch (error) {
      this.logger.info(
        `error on getRecurrentExpenses in ReccurentExpensesService for ${recurrence} recurrence`
      );
      throw error;
    }
  }
}
