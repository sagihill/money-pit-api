import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, SalaryTypes, ResponseStatus } from "../../types";

export const salaryRequestBody = {
  accountId: Joi.string().required().uuid(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  payDay: Joi.number().required(),
};

export const addSalaryValidator = Joi.object().keys(salaryRequestBody);

const add: RequestHandler = async (
  req: Request<{}, {}, SalaryTypes.Requests.AddRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();

    const { accountId, amount, currency, payDay } = req.body;

    const salary = await salaryService.add({
      accountId,

      amount,
      currency,
      payDay,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Added new salary",
      data: { salary },
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new salary",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addSalaryValidator },
});
