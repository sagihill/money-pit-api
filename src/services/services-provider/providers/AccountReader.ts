import { AccountTypes } from "../../../types";
import { AccountReaderService, getAccountRepository } from "../../account";
import { ServicesProvider } from "../services-provider";

export default async function AccountReader(
  options: any,
  SP: ServicesProvider
): Promise<AccountTypes.IAccountReaderService> {
  const logger = await SP.Logger();
  const accountRepo = getAccountRepository();
  const accountReaderService = new AccountReaderService(accountRepo, logger);

  return accountReaderService;
}
