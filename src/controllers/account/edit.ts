import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { AccountTypes } from "../../types";

export const editAccountRequestValidator = Joi.object().keys({
  configuration: {
    incomes: Joi.array(),
    members: Joi.array(),
    budget: Joi.object(),
    recurrentExpenses: Joi.array(),
  },
});

const edit: RequestHandler = async (
  req: Request<any, {}, AccountTypes.EditAccountRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();

  const { configuration } = req.body;
  await accountService.edit(req.params.id, {
    configuration,
  });

  res.send({
    message: "Edited",
  });
};

export default requestMiddleware(edit, {
  validation: { body: editAccountRequestValidator },
});
