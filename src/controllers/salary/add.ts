import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { SalaryTypes, TechTypes } from "../../types";

export const salaryNewAccountRequestBody = {
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  payDay: Joi.number().required(),
};

export const salaryRequestBody = {
  accountId: Joi.string().required().uuid(),
  ...salaryNewAccountRequestBody,
};

export const addSalaryValidator = Joi.object().keys(salaryRequestBody);

const add: RequestHandler = async (
  req: Request<{}, {}, SalaryTypes.Requests.AddRequest, any>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();

    const { accountId, amount, currency, payDay } = req.body;
    await Utils.validateAccountMembership(req, accountId as string);

    const salary = await salaryService.add({
      accountId,
      amount,
      currency,
      payDay,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Added new salary",
      data: { salary },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to add new salary",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addSalaryValidator },
});
