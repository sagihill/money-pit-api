import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../lib/common";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes } from "../../types";
import { configurationKeysValidation } from "../account-configuration/update";

export const addAccountRequestValidation = Joi.object().keys({
  type: Joi.string().required(),
  configuration: configurationKeysValidation,
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.Requests.AddAccountNetworkRequest>,
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
    configuration,
  });

  await userService.edit(userId, { accountId: accountDetails.id });

  res.send({
    message: "Saved",
    user: JSON.stringify(accountDetails),
  });
};

export default requestMiddleware(add, {
  validation: { body: addAccountRequestValidation },
});
