import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes, ApiResponse, ResponseStatus } from "../../types";
import { accountConfigurationRequestBody } from "../account-configuration/update";
import { creditAccountRequestBody } from "../credit-account/add";
import { recurrentExpenseRequestBody } from "../recurrent-expense/add";
import { salaryRequestBody } from "../salary/add";

export const addAccountRequestValidation = Joi.object().keys({
  type: Joi.string().required(),
  configuration: accountConfigurationRequestBody,
  salaries: [salaryRequestBody],
  creditAccounts: [creditAccountRequestBody],
  recurrentExpenses: [recurrentExpenseRequestBody],
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.Requests.AddRequest>,
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
      await accountService.remove(currentAccount.id);
    }

    const account = await accountService.add({
      type,
      adminUserId: userId,
      configuration,
      salaries,
      creditAccounts,
      recurrentExpenses,
    });

    await userService.update(userId, { accountId: account.id });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Added new account.",
      data: { account },
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new account.",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addAccountRequestValidation },
});
