import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const removeSalaryRequestParamsValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const salaryService = await SP.Salary();
    const { id } = req.params;

    await salaryService.remove(id);

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: `Salary ${id} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `removing salary ${req.body.id} had an error.`,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(remove, {
  validation: {
    params: removeSalaryRequestParamsValidator,
  },
});
