import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  AccountConfigurationTypes,
  ApiResponse,
  Currency,
  ResponseStatus,
} from "../../types";

export const accountConfigurationRequestBody = {
  budget: { totalBudget: Joi.number(), categoriesBudget: Joi.object() },
  toggles: {
    enableAutoExpenseAdd: Joi.boolean(),
  },
};

export const updateAccountConfigurationRequestBodyValidator = Joi.object().keys(
  accountConfigurationRequestBody
);

export const updateAccountConfigurationRequestParamsValidator =
  Joi.object().keys({
    accountId: Joi.string().uuid().required(),
  });

const update: RequestHandler = async (
  req: Request<
    ParamsDictionary,
    {},
    AccountConfigurationTypes.Requests.UpdateRequest
  >,
  res
) => {
  const { budget, toggles } = req.body;
  const { accountId } = req.params;
  try {
    const SP = ServicesProvider.get();
    const accountConfiguration = await SP.AccountConfiguration();

    await accountConfiguration.update(accountId, {
      budget,
      toggles,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: `Updated account_${accountId} configuration.`,
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `Updating account_${accountId} configuration had an error.`,
      error,
    };
    res.status(400).send(response);
  }
};

export default requestMiddleware(update, {
  validation: {
    body: updateAccountConfigurationRequestBodyValidator,
    params: updateAccountConfigurationRequestParamsValidator,
  },
});
