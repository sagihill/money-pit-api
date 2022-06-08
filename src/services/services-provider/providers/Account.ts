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
  const accountRepo = getAccountRepository();
  const accountService = new AccountService(
    userService,
    accountRepo,
    accountConfiguration,
    logger
  );

  return accountService;
}
