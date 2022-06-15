import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { TechTypes } from "../../types";

export const removeExpenseRequestBodyValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
  accountId: Joi.string().uuid().required(),
});

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountingService = await SP.Accounting();
    const { id, accountId } = req.body;

    await Utils.validateAccountOwnership(req, accountId);

    await accountingService.removeAccountOne(id, accountId);

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: `Expense ${id} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `removing expense ${req.body.id} had an error.`,
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
    body: removeExpenseRequestBodyValidator,
  },
});
