import { AccountingTypes } from "../../../types";
import { AccountingService, getAccountingRepository } from "../../accounting";
import { ServicesProvider } from "../services-provider";

export default async function Accounting(
  options: any,
  SP: ServicesProvider
): Promise<AccountingTypes.IAccountingService> {
  const logger = await SP.Logger();
  const account = await SP.Account();
  const config = await SP.Config();

  const configuration: AccountingTypes.AccountingServiceConfiguration = {
    accountingSummeryDatesWindow: {
      lowerChargeDay: await config.getNumber("LOWER_CHARGE_DAY"),
      upperChargeDay: await config.getNumber("UPPER_CHARGE_DAY"),
      lowerTimestampDay: await config.getNumber("LOWER_TIMESTAMP_DAY"),
      upperTimestampDay: await config.getNumber("UPPER_TIMESTAMP_DAY"),
    },
  };

  const repository = getAccountingRepository(logger);
  const accountingService = new AccountingService(
    account,
    repository,
    { configuration, ...options },
    logger
  );

  return accountingService;
}
