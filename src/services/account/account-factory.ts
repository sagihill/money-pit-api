import { ID } from "../../lib/common";
import { AccountTypes } from "../../types";

export function createNewAccountDetails(
  request: AccountTypes.Requests.AddAccountRequest
) {
  const now = new Date();

  const accountDetails: AccountTypes.AccountDetails = {
    ...request,
    members: [request.adminUserId],

    id: ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return accountDetails;
}
