import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ConfigTypes } from "../../types";

export const editValidation = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
  deleted: Joi.boolean(),
});

const edit: RequestHandler = async (
  req: Request<{}, {}, ConfigTypes.EditConfigRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();

  const { key, value, deleted } = req.body;

  await config.edit({ key, value, deleted });

  res.send({
    message: "Edited",
  });
};

export default requestMiddleware(edit, {
  validation: { body: editValidation },
});
