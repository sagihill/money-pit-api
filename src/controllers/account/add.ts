import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes } from "../../types";

export const addAccountRequestValidator = Joi.object().keys({
  type: Joi.string().required(),
  configuration: {
    incomes: Joi.array().required(),
    members: Joi.array(),
    budget: Joi.object(),
    recurrentExpenses: Joi.array(),
  },
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.AddAccountNetworkRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();
  const userService = await SP.User();

  const { type, configuration } = req.body;
  const userId = await Utils.getUserIdFromRequest(req);

  const accountDetails = await accountService.add({
    type,
    adminUserId: userId,
    configuration: {
      members: [userId],
      incomes: configuration.incomes,
      budget: configuration.budget,
      recurrentExpenses: configuration.recurrentExpenses,
    },
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
