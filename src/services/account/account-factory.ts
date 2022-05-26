import { ID } from "../../lib/common";
import { AccountTypes } from "../../types";

export function createNewAccountDetails(
  request: AccountTypes.AddAccountRequest
) {
  const now = new Date();
  const totalIncome = request.configuration.incomes.reduce(
    (acc, income) => acc + income.amount,
    0
  );
  const accountDetails: AccountTypes.AccountDetails = {
    ...request,
    configuration: {
      ...request.configuration,
      budget: {
        ...request.configuration.budget,
        totalBudget: request.configuration.budget?.totalBudget ?? totalIncome,
      },
    },
    id: ID.get(),
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  return accountDetails;
}
