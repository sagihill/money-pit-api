import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const getSalaryRequestParamsValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();
    const { id } = req.params;

    const salary = await salaryService.get(id);
    if (!salary) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message: `Salary ${id} not found.`,
      };

      res.send(response);
    } else {
      const response: ApiResponse = {
        status: ResponseStatus.success,
        message: "Found salary.",
        data: { salary },
      };

      res.send(response);
    }
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
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
    params: getSalaryRequestParamsValidator,
  },
});
