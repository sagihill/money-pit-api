import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import { Utils } from "../../../lib";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { AccountConfigurationTypes, TechTypes } from "../../../types";

export const accountConfigurationRequestBody = {
  budget: { totalBudget: Joi.number(), categoriesBudget: Joi.object() },
  toggles: {
    enableAutoExpenseAdd: Joi.boolean(),
    enableAccountSummeryEmail: Joi.boolean(),
  },
};

export const updateAccountConfigurationRequestBodyValidator = Joi.object().keys(
  accountConfigurationRequestBody
);

export const updateAccountConfigurationRequestQueryValidator =
  Joi.object().keys({
    accountId: Joi.string().uuid().required(),
  });

const update: RequestHandler = async (
  req: Request<
    ParamsDictionary,
    {},
    AccountConfigurationTypes.Requests.UpdateRequest,
    any
  >,
  res
) => {
  const { budget, toggles } = req.body;
  const { accountId } = req.query;
  try {
    const SP = ServicesProvider.get();
    const accountConfiguration = await SP.AccountConfiguration();

    await Utils.validateAccountMembership(req, accountId);

    await accountConfiguration.update(accountId, {
      budget,
      toggles,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: `Updated account_${accountId} configuration.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `Updating account_${accountId} configuration had an error.`,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };
    res.status(400).send(response);
  }
};

export default requestMiddleware(update, {
  validation: {
    body: updateAccountConfigurationRequestBodyValidator,
    query: updateAccountConfigurationRequestQueryValidator,
  },
});
