import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { TechTypes, CreditAccountTypes } from "../../types";

export const creditAccountNewAccountRequestBody = {
  creditProvider: Joi.string().required(),
  credentials: {
    username: Joi.string().required(),
    password: Joi.string().required(),
  },
};

export const creditAccountRequestBody = {
  accountId: Joi.string().required().uuid(),
  ...creditAccountNewAccountRequestBody,
};

export const addCreditAccountValidator = Joi.object().keys(
  creditAccountRequestBody
);

const add: RequestHandler = async (
  req: Request<{}, {}, CreditAccountTypes.Requests.AddRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const creditAccountService = await SP.CreditAccount();

    const { accountId, creditProvider, credentials } = req.body;
    await Utils.validateAccountMembership(req, accountId);

    const creditAccount = await creditAccountService.add({
      accountId,
      creditProvider,
      credentials,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Added new credit account",
      data: { creditAccountId: creditAccount.id },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to add new credit account",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addCreditAccountValidator },
});
