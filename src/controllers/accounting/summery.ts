import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountingTypes } from "../../types";

export const getSummeryRequestValidator = Joi.object().keys({
  timeFrame: Joi.object().required(),
});

const summery: RequestHandler = async (
  req: Request<{}, {}, AccountingTypes.GetSummeryRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountingService = await SP.Accounting();
  const userService = await SP.User();

  const { timeFrame } = req.body;
  const userId = await Utils.getUserIdFromRequest(req);

  const user = await userService.get(userId);

  if (!user?.accountId) {
    throw new Error("User don't have an account yet.");
  }

  const summery = await accountingService.getAccountSummery(user.accountId, {
    from: new Date(timeFrame.from),
    to: new Date(timeFrame.to),
  });

  res.send({
    message: "Success",
    data: {
      summery: JSON.stringify(summery),
    },
  });
};

export default requestMiddleware(summery, {
  validation: { body: getSummeryRequestValidator },
});
