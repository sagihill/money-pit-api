import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ConfigTypes } from "../../types";

export const removeMapEntryValidation = Joi.object().keys({
  mapName: Joi.string().required(),
  mapEntry: { key: Joi.string().required() },
});

const removeMapEntry: RequestHandler = async (
  req: Request<{}, {}, ConfigTypes.ConfigureMapEntryRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();

  const { mapName, mapEntry } = req.body;

  await config.removeMapEntry({ mapName, mapEntry });

  res.send({
    message: `Edited ${mapName} map`,
  });
};

export default requestMiddleware(removeMapEntry, {
  validation: { body: removeMapEntryValidation },
});
