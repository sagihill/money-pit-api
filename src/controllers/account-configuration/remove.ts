import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const removeAccountConfigurationRequestParamsValidator =
  Joi.object().keys({
    accountId: Joi.string().uuid().required(),
  });

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountConfiguration = await SP.AccountConfiguration();
    const { accountId } = req.params;

    await Utils.validateAccountOwnership(req, accountId);

    await accountConfiguration.remove(accountId);

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: `Account configuration for account ${accountId} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `removing account configuration for account ${req.params.accountId} had an error.`,
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
    params: removeAccountConfigurationRequestParamsValidator,
  },
});
