import { CreditAccountTypes } from "../../../types";
import {
  CreditAccountService,
  getCreditAccountRepository,
} from "../../credit-account";
import { ServicesProvider } from "../services-provider";
import Cryptr from "cryptr";

export default async function CreditAccount(
  options: any,
  SP: ServicesProvider
): Promise<CreditAccountTypes.ICreditAccountService> {
  const logger = await SP.Logger();
  const account = await SP.Account();
  const repo = getCreditAccountRepository();
  const config = await SP.Config();
  const crypter = new Cryptr(await config.get("CREDIT_ACCOUNTS_SECRET"));

  const salaryService = new CreditAccountService(
    account,
    crypter,
    repo,
    logger
  );

  return salaryService;
}
