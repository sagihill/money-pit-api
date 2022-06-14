import { RecurrentExpenseTypes } from "../../../types";
import {
  getReccurentExpensesRepository,
  ReccurentExpensesService,
} from "../../recurrent-expenses";
import { ServicesProvider } from "../services-provider";

export default async function RecurrentExpense(
  options: any,
  SP: ServicesProvider
): Promise<RecurrentExpenseTypes.IReccurentExpensesService> {
  const account = await SP.AccountReader();
  const logger = await SP.Logger();
  const repo = getReccurentExpensesRepository();
  const recurrentExpenseService = new ReccurentExpensesService(
    account,
    repo,
    logger
  );
  return recurrentExpenseService;
}
