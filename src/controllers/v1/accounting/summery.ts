import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../../lib/utils";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { AccountingTypes, TechTypes } from "../../../types";

export const getSummeryRequestQueryValidator = Joi.object().keys({
  year: Joi.string()
    .required()
    .regex(/^[12][0-9]{3}$/),
  month: Joi.string()
    .required()
    .regex(/^(0?[1-9]|1[012])$/),
});

const summery: RequestHandler = async (
  req: Request<{}, {}, AccountingTypes.Requests.GetSummeryRequest, any>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const accountingService = await SP.Accounting();
    const userService = await SP.User();
    const validationService = await SP.Validation();

    const { month, year } = req.query;
    const userId = await Utils.getUserIdFromRequest(req);

    const user = await userService.get(userId);

    if (!user?.accountId) {
      throw new Error("User don't have an account yet.");
    }

    await validationService.validateAccountExist(user?.accountId);

    const summery = await accountingService.getAccountSummery(user.accountId, {
      year,
      month,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Found account expense summery.",
      data: { summery },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to get account summery",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(summery, {
  validation: { query: getSummeryRequestQueryValidator },
});
