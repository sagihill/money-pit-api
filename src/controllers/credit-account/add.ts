import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, CreditAccountTypes, ResponseStatus } from "../../types";

export const creditAccountRequestBody = {
  accountId: Joi.string().required().uuid(),
  creditProvider: Joi.string().required(),
  credentials: {
    username: Joi.string().required().lowercase(),
    password: Joi.string().required().length(16),
  },
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

    const creditAccount = await creditAccountService.add({
      accountId,
      creditProvider,
      credentials,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "Added new credit account",
      data: { creditAccountId: creditAccount.id },
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new credit account",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addCreditAccountValidator },
});
