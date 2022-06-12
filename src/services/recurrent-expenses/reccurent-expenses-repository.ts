import { MongoRepository } from "../../lib/repository";
import RecurrentExpense from "../../models/RecurrentExpense";
import { RecurrentExpenseTypes } from "../../types";

export const getReccurentExpensesRepository = () => {
  return new ReccurentExpensesRepository(RecurrentExpense);
};

class ReccurentExpensesRepository extends MongoRepository<
  RecurrentExpenseTypes.RecurrentExpense,
  RecurrentExpenseTypes.Requests.UpdateRequest
> {}
