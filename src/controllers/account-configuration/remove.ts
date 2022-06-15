import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { TechTypes } from "../../types";

export const removeAccountConfigurationRequestBodyValidator = Joi.object().keys(
  {
    accountId: Joi.string().uuid().required(),
  }
);

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountConfiguration = await SP.AccountConfiguration();
    const { accountId } = req.body;

    await Utils.validateAccountOwnership(req, accountId);

    await accountConfiguration.remove(accountId);

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: `Account configuration for account ${accountId} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
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
    body: removeAccountConfigurationRequestBodyValidator,
  },
});
