import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountingTypes } from "../../types";

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
  req: Request<{}, {}, AccountingTypes.AddExpenseRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountingService = await SP.Accounting();
  const userService = await SP.User();

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
  const userId = await Utils.getUserIdFromRequest(req);

  const user = await userService.get(userId);

  if (accountId !== user?.accountId) {
    throw new Error("Account doesn't belong to user");
  }

  const expense = await accountingService.createNewExpense({
    accountId,
    name,
    amount,
    category,
    currency,
    type,
    description,
    timestamp,
  });

  await accountingService.addExpenses([expense]);

  res.send({
    message: "Saved",
    data: {
      expense,
    },
  });
};

export default requestMiddleware(add, {
  validation: { body: addExpenseRequestValidator },
});
