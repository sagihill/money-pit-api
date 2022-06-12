import { AccountTypes } from "../../../types";
import { AccountService, getAccountRepository } from "../../account";
import { ServicesProvider } from "../services-provider";

export default async function Account(
  options: any,
  SP: ServicesProvider
): Promise<AccountTypes.IAccountService> {
  const logger = await SP.Logger();
  const userService = await SP.User();
  const accountConfiguration = await SP.AccountConfiguration();
  const recurrentExpense = await SP.RecurrentExpense();
  const salaryService = await SP.Salary();
  const creditAccountService = await SP.CreditAccount();
  const accountRepo = getAccountRepository();
  const accountService = new AccountService(
    userService,
    accountConfiguration,
    recurrentExpense,
    salaryService,
    creditAccountService,
    accountRepo,
    logger
  );

  return accountService;
}
