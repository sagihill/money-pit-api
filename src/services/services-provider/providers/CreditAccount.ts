import { CreditAccountTypes } from "../../../types";
import {
  CreditAccountService,
  getCreditAccountRepository,
} from "../../credit-account";
import { ServicesProvider } from "../services-provider";

export default async function CreditAccount(
  options: any,
  SP: ServicesProvider
): Promise<CreditAccountTypes.ICreditAccountService> {
  const logger = await SP.Logger();
  const account = await SP.AccountReader();
  const repo = getCreditAccountRepository();
  const crypto = await SP.Crypto();
  const salaryService = new CreditAccountService(account, crypto, repo, logger);

  return salaryService;
}
