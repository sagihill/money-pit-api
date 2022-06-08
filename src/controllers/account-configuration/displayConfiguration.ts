import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  AccountConfigurationTypes,
  ApiResponse,
  ResponseStatus,
} from "../../types";

export const displayConfigurationRequestValidator = Joi.object().keys({
  accountId: Joi.string().required().uuid(),
});

const display: RequestHandler = async (
  req: Request<
    {},
    {},
    AccountConfigurationTypes.Requests.UpdateConfigurationNetworkRequest
  >,
  res
) => {
  const { accountId } = req.body;
  try {
    const SP = ServicesProvider.get();
    const account = await SP.Account();

    const configuration = await account.displayConfiguration(accountId);

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: `Disaply configuration for account_${accountId} fetched sucessfully.`,
      data: { configuration },
    };

    res.send(response);
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: `Displaying account_${accountId} configuration had an error.`,
      error,
    };
    res.status(400).send(response);
  }
};

export default requestMiddleware(display, {
  validation: { body: displayConfigurationRequestValidator },
});
