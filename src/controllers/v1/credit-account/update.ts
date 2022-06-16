import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ParamsDictionary } from "..";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { CreditAccountTypes, TechTypes } from "../../../types";

export const updateCreditAccountBodyValidator = Joi.object().keys({
  creditProvider: Joi.string(),
  credentials: {
    username: Joi.string(),
    password: Joi.string(),
  },
});

export const updateCreditAccountQueryValidator = Joi.object().keys({
  id: Joi.string().required().uuid(),
  accountId: Joi.string().required().uuid(),
});

const update: RequestHandler = async (
  req: Request<
    ParamsDictionary,
    {},
    CreditAccountTypes.Requests.UpdateRequest,
    any
  >,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const creditAccountService = await SP.CreditAccount();

    const { creditProvider, credentials } = req.body;

    await creditAccountService.updateAccountOne(
      req.query.id,
      req.query.accountId,
      {
        creditProvider,
        credentials,
      }
    );

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Updated credit account",
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
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
    query: updateCreditAccountQueryValidator,
  },
});
