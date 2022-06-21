import { TechTypes } from "../types";
import ApplicationError from "./application-error";

export const getValidationErrorResponse = (
  error: ApplicationError
): TechTypes.ApiResponse => {
  return {
    status: TechTypes.ResponseStatus.error,
    message: "Request failed validation.",
    error,
  };
};
