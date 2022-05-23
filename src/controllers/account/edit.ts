import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes } from "../../types";

export const editAccountRequestValidator = Joi.object().keys({
  income: Joi.object().required(),
});

const edit: RequestHandler = async (
  req: Request<any, {}, AccountTypes.EditAccountRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();

  const { income } = req.body;
  await accountService.edit(req.params.id, {
    income,
  });

  res.send({
    message: "Edited",
  });
};

export default requestMiddleware(edit, {
  validation: { body: editAccountRequestValidator },
});
