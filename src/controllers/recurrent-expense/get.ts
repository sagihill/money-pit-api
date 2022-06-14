import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const getRecurrentExpenseRequestBodyValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
  accountId: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const recurrentExpenseService = await SP.RecurrentExpense();
    const { id, accountId } = req.body;
    await Utils.validateAccountMembership(req, accountId as string);
    const recurrentExpense = await recurrentExpenseService.findAccountOne(
      id,
      accountId
    );

    if (!recurrentExpense) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message: `Recurrent expense ${id} not found.`,
      };

      res.send(response);
    } else {
      const response: ApiResponse = {
        status: ResponseStatus.success,
        message: "Found recurrent expense.",
        data: { recurrentExpense },
      };

      res.send(response);
    }
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `finding recurrent expense ${req.body.id} had an error.`,
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
    body: getRecurrentExpenseRequestBodyValidator,
  },
});
