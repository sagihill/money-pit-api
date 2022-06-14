import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountingTypes } from "../../types";

export const updateExpenseRequestValidator = Joi.object().keys({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  category: Joi.string().required(),
  currency: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  timestamp: Joi.date(),
});

const update: RequestHandler = async (
  req: Request<any, {}, AccountingTypes.Requests.UpdateRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountingService = await SP.Accounting();

  const { name, amount, category, currency, type, description, timestamp } =
    req.body;
  await accountingService.editExpense(req.params.id, {
    name,
    amount,
    category,
    currency,
    type,
    description,
    timestamp,
  });

  res.send({
    message: "Edited",
  });
};

export default requestMiddleware(update, {
  validation: { body: updateExpenseRequestValidator },
});
