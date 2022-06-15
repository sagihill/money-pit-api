import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { TechTypes } from "../../types";

export const getSalaryRequestBodyValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
  accountId: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();

    const { id, accountId } = req.body;
    await Utils.validateAccountMembership(req, accountId as string);
    const salary = await salaryService.findAccountOne(id, accountId);

    if (!salary) {
      const response: TechTypes.ApiResponse = {
        status: TechTypes.ResponseStatus.failure,
        message: `Salary ${id} not found.`,
      };

      res.send(response);
    } else {
      const response: TechTypes.ApiResponse = {
        status: TechTypes.ResponseStatus.success,
        message: "Found salary.",
        data: { salary },
      };

      res.send(response);
    }
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `finding salary ${req.body.id} had an error.`,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(get, {
  validation: {
    body: getSalaryRequestBodyValidator,
  },
});
