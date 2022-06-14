import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  ApiResponse,
  RecurrentExpenseTypes,
  ResponseStatus,
} from "../../types";

export const recurrentExpenseNewAccountRequestBody = {
  category: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  dueDay: Joi.number().required(),
  recurrence: Joi.string().required(),
};
export const recurrentExpenseRequestBody = {
  accountId: Joi.string().required().uuid(),
  ...recurrentExpenseNewAccountRequestBody,
};

export const addRecurrentExpenseValidator = Joi.object().keys(
  recurrentExpenseRequestBody
);

const add: RequestHandler = async (
  req: Request<{}, {}, RecurrentExpenseTypes.Requests.AddRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const recurrentExpenseService = await SP.RecurrentExpense();

    const {
      accountId,
      category,
      name,
      type,
      description,
      amount,
      currency,
      dueDay,
      recurrence,
    } = req.body;

    await Utils.validateAccountMembership(req, accountId as string);

    const recurrentExpense = await recurrentExpenseService.add({
      accountId,
      category,
      name,
      type,
      description,
      amount,
      currency,
      dueDay,
      recurrence,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Added new recurrent expense",
      data: { recurrentExpense },
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new recurrent expense",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addRecurrentExpenseValidator },
});
