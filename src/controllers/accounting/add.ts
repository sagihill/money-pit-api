import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountingTypes, TechTypes } from "../../types";

export const addExpenseRequestValidator = Joi.object().keys({
  accountId: Joi.string().required().uuid(),
  name: Joi.string().required(),
  amount: Joi.number().required(),
  category: Joi.string().required(),
  currency: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  timestamp: Joi.date(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountingTypes.Requests.AddRequest, any>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const accountingService = await SP.Accounting();

    const {
      accountId,
      amount,
      category,
      currency,
      name,
      type,
      description,
      timestamp,
    } = req.body;
    await Utils.validateAccountMembership(req, accountId as string);

    const expense = await accountingService.add({
      accountId,
      name,
      amount,
      category,
      currency,
      type,
      description,
      timestamp,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Added new expense",
      data: { expense },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to add new expense",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addExpenseRequestValidator },
});
