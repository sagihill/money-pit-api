import { Request, RequestHandler } from "express";
import Joi, { Err } from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { TechTypes } from "../../types/tech-types";

export const getAccountConfigurationRequestParamsValidator = Joi.object().keys({
  accountId: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountConfigurationService = await SP.AccountConfiguration();
    const { accountId } = req.params;
    await Utils.validateAccountMembership(req, accountId);

    const accountConfiguration = await accountConfigurationService.get(
      accountId
    );
    if (!accountConfiguration) {
      const response: TechTypes.ApiResponse = {
        status: TechTypes.ResponseStatus.failure,
        message: `account configuration for account ${accountId} not found.`,
      };

      res.send(response);
    } else {
      const response: TechTypes.ApiResponse = {
        status: TechTypes.ResponseStatus.success,
        message: "Found account configuration.",
        data: { accountConfiguration },
      };

      res.send(response);
    }
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `finding account configuration for account ${req.params.accountId} had an error.`,
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
    params: getAccountConfigurationRequestParamsValidator,
  },
});
