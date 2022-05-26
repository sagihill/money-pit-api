import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ConfigTypes } from "../../types";

export const addConfigRequestValidation = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, ConfigTypes.AddConfigRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();

  const { key, value } = req.body;
  // const userId = await Utils.getUserIdFromRequest(req);

  //TODO: validate admin user

  await config.add({ key, value });

  res.send({
    message: "Saved",
  });
};

export default requestMiddleware(add, {
  validation: { body: addConfigRequestValidation },
});
