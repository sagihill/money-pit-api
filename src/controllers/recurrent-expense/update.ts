import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  ApiResponse,
  RecurrentExpenseTypes,
  ResponseStatus,
} from "../../types";

export const updateRecurrentExpenseBodyValidator = Joi.object().keys({
  category: Joi.string(),
  name: Joi.string(),
  type: Joi.string(),
  description: Joi.string(),
  amount: Joi.number(),
  currency: Joi.string(),
  dueDay: Joi.number(),
  recurrence: Joi.string(),
});

export const updateRecurrentExpenseParamsValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<
    ParamsDictionary,
    {},
    RecurrentExpenseTypes.Requests.UpdateRequest
  >,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const recurrentExpenseService = await SP.RecurrentExpense();

    const {
      category,
      name,
      type,
      description,
      amount,
      currency,
      dueDay,
      recurrence,
    } = req.body;

    const recurrentExpense = await recurrentExpenseService.update(
      req.params.id,
      {
        category,
        name,
        type,
        description,
        amount,
        currency,
        dueDay,
        recurrence,
      }
    );

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Updated recurrent expense.",
      data: { recurrentExpense },
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to update recurrent expense",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(update, {
  validation: {
    body: updateRecurrentExpenseBodyValidator,
    params: updateRecurrentExpenseParamsValidator,
  },
});
