import { AccountTypes } from "../../../types";
import {
  AccountReaderService,
  getAccountRepository,
  getAccountUserRepository,
} from "../../account";
import { ServicesProvider } from "../services-provider";

export default async function AccountReader(
  options: any,
  SP: ServicesProvider
): Promise<AccountTypes.IAccountReaderService> {
  const logger = await SP.Logger();
  const accountRepo = getAccountRepository();
  const accountUserRepo = getAccountUserRepository();
  const accountReaderService = new AccountReaderService(
    accountUserRepo,
    accountRepo,
    logger
  );

  return accountReaderService;
}
