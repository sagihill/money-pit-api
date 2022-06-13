import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus } from "../../types";

export const getAccountConfigurationRequestParamsValidator = Joi.object().keys({
  accountId: Joi.string().uuid().required(),
});

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const accountConfigurationService = await SP.AccountConfiguration();
    const { accountId } = req.params;

    const accountConfiguration = await accountConfigurationService.get(
      accountId
    );
    if (!accountConfiguration) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message: `account configuration for account ${accountId} not found.`,
      };

      res.send(response);
    } else {
      const response: ApiResponse = {
        status: ResponseStatus.success,
        message: `Found account configuration.`,
        data: { accountConfiguration },
      };

      res.send(response);
    }
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.failure,
      message: `finding account configuration for account ${req.body.accountId} had an error.`,
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(get, {
  validation: {
    params: getAccountConfigurationRequestParamsValidator,
  },
});
