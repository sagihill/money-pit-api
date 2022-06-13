import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const removeCreditAccountRequestParamsValidator = Joi.object().keys({
  id: Joi.string().uuid().required(),
});

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const creditAccountService = await SP.CreditAccount();
    const { id } = req.params;

    await creditAccountService.remove(id);

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: `Credit account ${id} deleted successfully.`,
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `removing credit account ${req.body.id} had an error.`,
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(remove, {
  validation: {
    params: removeCreditAccountRequestParamsValidator,
  },
});
