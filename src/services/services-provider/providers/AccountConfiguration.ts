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
  const account = await SP.Account();
  const repo = getAccountConfigurationRepository();
  const accountConfigurationService = new AccountConfigurationService(
    account,
    repo,
    logger
  );

  return accountConfigurationService;
}
