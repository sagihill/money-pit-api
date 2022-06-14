import { SalaryTypes } from "../../../types";
import { SalaryService, getSalaryRepository } from "../../salary";
import { ServicesProvider } from "../services-provider";

export default async function Salary(
  options: any,
  SP: ServicesProvider
): Promise<SalaryTypes.ISalaryService> {
  const logger = await SP.Logger();
  const account = await SP.AccountReader();
  const repo = getSalaryRepository();
  const salaryService = new SalaryService(account, repo, logger);

  return salaryService;
}
