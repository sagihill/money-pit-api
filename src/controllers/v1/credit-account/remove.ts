import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../../lib";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { TechTypes } from "../../../types";

export const removeCreditAccountRequestBodyValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
  accountId: Joi.string().uuid().required(),
});

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const creditAccountService = await SP.CreditAccount();
    const { id, accountId } = req.body;
    await Utils.validateAccountMembership(req, accountId as string);

    await creditAccountService.removeAccountOne(id, accountId);

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: `Credit account ${id} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `removing credit account ${req.body.id} had an error.`,
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
    body: removeCreditAccountRequestBodyValidator,
  },
});
