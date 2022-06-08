import Cryptr from "cryptr";
import { AccountConfigurationTypes } from "../../../types";
import {
  AccountConfigurationService,
  getAccountConfigurationRepository,
} from "../../account-configuration";
import { ServicesProvider } from "../services-provider";

export default async function AccountConfiguration(
  options: any,
  SP: ServicesProvider
): Promise<AccountConfigurationTypes.IAccountConfigurationService> {
  const logger = await SP.Logger();
  const recurrentExpenseService = await SP.RecurrentExpense();
  const config = await SP.Config();
  const repo = getAccountConfigurationRepository(logger);
  const crypter = new Cryptr(await config.get("CREDIT_ACCOUNTS_SECRET"));
  const accountConfigurationService = new AccountConfigurationService(
    repo,
    recurrentExpenseService,
    crypter,
    logger
  );

  return accountConfigurationService;
}
