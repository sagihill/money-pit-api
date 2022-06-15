import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountingTypes, TechTypes } from "../../types";

export const updateExpenseBodyValidator = Joi.object().keys({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  category: Joi.string().required(),
  currency: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  timestamp: Joi.date(),
});

export const updateExpenseQueryValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
  accountId: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<any, {}, AccountingTypes.Requests.UpdateRequest, any>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const accountingService = await SP.Accounting();

    const { name, amount, category, currency, type, description, timestamp } =
      req.body;

    const { id, accountId } = req.query;

    await accountingService.updateAccountOne(id, accountId, {
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
      message: "Updated expense",
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to update expense",
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
    body: updateExpenseBodyValidator,
    query: updateExpenseQueryValidator,
  },
});
