import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, CreditAccountTypes, ResponseStatus } from "../../types";

export const updateCreditAccountBodyValidator = Joi.object().keys({
  creditProvider: Joi.string(),
  credentials: {
    username: Joi.string().lowercase(),
    password: Joi.string().length(16),
  },
});

export const updateCreditAccountParamsValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<ParamsDictionary, {}, CreditAccountTypes.Requests.UpdateRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const creditAccountService = await SP.CreditAccount();

    const { creditProvider, credentials } = req.body;

    await creditAccountService.update(req.params.id, {
      creditProvider,
      credentials,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Updated credit account",
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to update credit account",
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
    body: updateCreditAccountBodyValidator,
    params: updateCreditAccountParamsValidator,
  },
});
