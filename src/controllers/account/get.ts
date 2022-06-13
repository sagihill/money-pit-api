import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const getAccountRequestParamsValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountService = await SP.Account();
    const { id } = req.params;

    const account = await accountService.get(id);
    if (!account) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message: `Account ${id} not found.`,
      };

      res.send(response);
    } else {
      const response: ApiResponse = {
        status: ResponseStatus.success,
        message: `Found account.`,
        data: { account },
      };

      res.send(response);
    }
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.failure,
      message: `finding account ${req.body.id} had an error.`,
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(get, {
  validation: {
    params: getAccountRequestParamsValidator,
  },
});
