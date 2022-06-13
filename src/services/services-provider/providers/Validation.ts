import { ValidationTypes } from "../../../types";
import { ServicesProvider } from "../services-provider";
import { ValidationService } from "../../validation-service";

export default async function Validation(
  SP: ServicesProvider
): Promise<ValidationTypes.IValidationService> {
  const account = await SP.Account();
  const valiationService = new ValidationService(account);

  return valiationService;
}
