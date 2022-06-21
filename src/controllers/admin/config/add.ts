import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { ConfigTypes, TechTypes } from "../../../types";

export const addConfigRequestValidation = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, ConfigTypes.AddConfigRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const config = await SP.Config();

    const { key, value } = req.body;

    await config.add({ key, value });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "Added new config.",
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "Unable to add new config",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(add, {
  validation: { body: addConfigRequestValidation },
});
