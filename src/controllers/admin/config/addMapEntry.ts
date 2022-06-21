import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { ConfigTypes } from "../../../types";

export const addMapEntryValidation = Joi.object().keys({
  mapName: Joi.string().required(),
  mapEntry: { key: Joi.string().required(), value: Joi.string().required() },
});

const addMapEntry: RequestHandler = async (
  req: Request<{}, {}, ConfigTypes.ConfigureMapEntryRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();

  const { mapName, mapEntry } = req.body;

  await config.addMapEntry({ mapName, mapEntry });

  res.send({
    message: `Added Entry to ${mapName}`,
  });
};

export default requestMiddleware(addMapEntry, {
  validation: { body: addMapEntryValidation },
});
