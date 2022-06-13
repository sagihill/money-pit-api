import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import {
  ApiResponse,
  AccountConfigurationTypes,
  ResponseStatus,
} from "../../types";

export const accountConfigurationRequestBody = {
  budget: { totalBudget: Joi.number(), categoriesBudget: Joi.object() },
  toggles: {
    enableAutoExpenseAdd: Joi.boolean(),
  },
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

    const currentAccountConfiguration = await accountConfigurationService.get(
      accountId
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
  } catch (error) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to add new account configuration",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addAccountConfigurationValidator },
});
