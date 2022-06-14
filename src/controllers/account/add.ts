import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes, ApiResponse, ResponseStatus } from "../../types";
import { accountConfigurationNewAccountRequestBody } from "../account-configuration/add";
import { creditAccountNewAccountRequestBody } from "../credit-account/add";
import { recurrentExpenseNewAccountRequestBody } from "../recurrent-expense/add";
import { salaryNewAccountRequestBody } from "../salary/add";

export const addAccountRequestValidation = Joi.object().keys({
  type: Joi.string().required(),
  configuration: accountConfigurationNewAccountRequestBody,
  salaries: Joi.array().items(salaryNewAccountRequestBody),
  creditAccounts: Joi.array().items(creditAccountNewAccountRequestBody),
  recurrentExpenses: Joi.array().items(recurrentExpenseNewAccountRequestBody),
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.Requests.AddNetworkRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const accountService = await SP.Account();
    const userService = await SP.User();
    const { type, configuration, salaries, creditAccounts, recurrentExpenses } =
      req.body;
    const userId = await Utils.getUserIdFromRequest(req);

    const currentAccount = await accountService.getByAdminUserId(userId);
    if (currentAccount) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message:
          "Can't add new account. An account for current user allready exists.",
      };

      res.send(response);
      return;
    }

    const account = await accountService.add({
      type,
      adminUserId: userId,
    });

    if (!account) {
      throw new AccountTypes.AccountAdditionError();
    }

    const accountId = account.id;

    const request = addAccountIdToRequests(
      { configuration, salaries, creditAccounts, recurrentExpenses },
      accountId
    );

    await accountService.addAccountConfigurations(request);

    await userService.update(userId, { accountId: account.id });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Added new account.",
      data: { account },
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new account.",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

function addAccountIdToRequests(
  request: AccountTypes.Requests.AddAccountConfigurationRequest,
  accountId: string
): AccountTypes.Requests.AddAccountConfigurationRequest {
  const translated: AccountTypes.Requests.AddAccountConfigurationRequest = {
    ...request,
  };
  if (translated.configuration) {
    translated.configuration = { ...translated.configuration, accountId };
  }

  if (translated.creditAccounts) {
    translated.creditAccounts.forEach(
      (creditAccount) => (creditAccount.accountId = accountId)
    );
  }

  if (translated.recurrentExpenses) {
    translated.recurrentExpenses.forEach(
      (recurrentExpense) => (recurrentExpense.accountId = accountId)
    );
  }

  if (translated.salaries) {
    translated.salaries.forEach((salary) => (salary.accountId = accountId));
  }
  return translated;
}

export default requestMiddleware(add, {
  validation: { body: addAccountRequestValidation },
});
