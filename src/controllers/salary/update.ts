import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { SalaryTypes, TechTypes } from "../../types";

export const updateSalaryBodyValidator = Joi.object().keys({
  amount: Joi.number(),
  currency: Joi.string(),
  payDay: Joi.number(),
});

export const updateSalaryQueryValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
  accountId: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<ParamsDictionary, {}, SalaryTypes.Requests.UpdateRequest, any>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();

    const { amount, currency, payDay } = req.body;
    const { id, accountId } = req.query;

    const salary = await salaryService.updateAccountOne(id, accountId, {
      amount,
      currency,
      payDay,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Updated salary.",
      data: { salary },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
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
    query: updateSalaryQueryValidator,
  },
});
