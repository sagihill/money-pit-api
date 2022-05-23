import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes, UserTypes } from "../../types";

export const addAccountRequestValidator = Joi.object().keys({
  type: Joi.string().required(),
  adminUserId: Joi.string().required(),
  members: Joi.array(),
  income: Joi.object().required(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, AccountTypes.AddAccountRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();

  const { type, adminUserId, members, income } = req.body;
  const accountDetails = await accountService.add({
    type,
    adminUserId,
    members,
    income,
  });

  res.send({
    message: "Saved",
    user: JSON.stringify(accountDetails),
  });
};

export default requestMiddleware(add, {
  validation: { body: addAccountRequestValidator },
});
