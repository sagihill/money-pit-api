import { ID } from "../../lib/common";
import { AccountTypes } from "../../types";

export function createNewAccountDetails(
  request: AccountTypes.AddAccountRequest
) {
  const now = new Date();
  const accountDetails: AccountTypes.AccountDetails = {
    ...request,
    id: ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return accountDetails;
}
