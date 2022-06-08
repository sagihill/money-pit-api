import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  AccountConfigurationTypes,
  ApiResponse,
  Currency,
  ResponseStatus,
} from "../../types";

export const configurationKeysValidation = {
  incomes: Joi.array().items({
    id: Joi.string().uuid(),
    amount: Joi.number(),
    currency: Joi.allow(...Object.values(Currency)),
    payDay: Joi.number(),
  }),
  creditAccounts: Joi.array().items({
    id: Joi.string().uuid(),
    creditProvider: Joi.allow(
      ...Object.values(AccountConfigurationTypes.CreditProvider)
    ),
    credentials: { username: Joi.string(), password: Joi.string() },
  }),
  budget: { totalBudget: Joi.number(), categoriesBudget: Joi.object() },
  recurrentExpenses: Joi.array().items({
    id: Joi.string().uuid(),
    accountId: Joi.string().required().uuid(),
    name: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    dueDay: Joi.number().required(),
    description: Joi.string(),
    recurrence: Joi.string().required(),
    type: Joi.string().required(),
  }),
};

export const updateAccountConfigurationRequestValidator = Joi.object().keys({
  accountId: Joi.string().required().uuid(),
  ...configurationKeysValidation,
});

const update: RequestHandler = async (
  req: Request<
    {},
    {},
    AccountConfigurationTypes.Requests.UpdateConfigurationNetworkRequest
  >,
  res
) => {
  const {
    creditAccounts,
    recurrentExpenses,
    budget,
    incomes,
    accountId,
    toggles,
  } = req.body;
  try {
    const SP = ServicesProvider.get();
    const account = await SP.Account();

    await account.editConfiguration(accountId, {
      creditAccounts,
      recurrentExpenses,
      budget,
      incomes,
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
  validation: { body: updateAccountConfigurationRequestValidator },
});
