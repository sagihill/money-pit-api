import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  ApiResponse,
  AccountConfigurationTypes,
  ResponseStatus,
} from "../../types";

export const accountConfigurationNewAccountRequestBody = {
  budget: { totalBudget: Joi.number(), categoriesBudget: Joi.object() },
  toggles: {
    enableAutoExpenseAdd: Joi.boolean(),
  },
};

export const accountConfigurationRequestBody = {
  accountId: Joi.string().uuid().required(),
  ...accountConfigurationNewAccountRequestBody,
};

export const addAccountConfigurationValidator = Joi.object().keys(
  accountConfigurationRequestBody
);

const add: RequestHandler = async (
  req: Request<{}, {}, AccountConfigurationTypes.Requests.AddRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const accountConfigurationService = await SP.AccountConfiguration();
    const { accountId, budget, toggles } = req.body;

    await Utils.validateAccountMembership(req, accountId as string);

    const currentAccountConfiguration = await accountConfigurationService.get(
      accountId as string
    );

    if (currentAccountConfiguration) {
      const response: ApiResponse = {
        status: ResponseStatus.failure,
        message:
          "Can't add new account configuration. configuration allready exist for this account.",
      };

      res.send(response);
    } else {
      const accountConfiguration = await accountConfigurationService.add({
        accountId,
        budget,
        toggles,
      });

      const response: ApiResponse = {
        status: ResponseStatus.success,
        message: "Added new account configuration",
        data: { accountConfiguration },
      };

      res.send(response);
    }
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new account configuration",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addAccountConfigurationValidator },
});
