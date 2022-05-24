import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes, UserTypes } from "../../types";

export const addAccountRequestValidator = Joi.object().keys({
  type: Joi.string().required(),
  income: Joi.object().required(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.AddAccountNetworkRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();
  const userService = await SP.User();

  const { type, income } = req.body;
  const userId = await Utils.getUserIdFromRequest(req);

  const accountDetails = await accountService.add({
    type,
    adminUserId: userId,
    members: [userId],
    income,
  });

  await userService.edit(userId, { accountId: accountDetails.id });

  res.send({
    message: "Saved",
    user: JSON.stringify(accountDetails),
  });
};

export default requestMiddleware(add, {
  validation: { body: addAccountRequestValidator },
});
