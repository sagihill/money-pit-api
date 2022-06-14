import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, SalaryTypes, ResponseStatus } from "../../types";

export const updateSalaryBodyValidator = Joi.object().keys({
  amount: Joi.number(),
  currency: Joi.string(),
  payDay: Joi.number(),
});

export const updateSalaryParamsValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<ParamsDictionary, {}, SalaryTypes.Requests.UpdateRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();

    const { amount, currency, payDay } = req.body;

    const salary = await salaryService.update(req.params.id, {
      amount,
      currency,
      payDay,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Updated salary.",
      data: { salary },
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to update salary",
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
    body: updateSalaryBodyValidator,
    params: updateSalaryParamsValidator,
  },
});
