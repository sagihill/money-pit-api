import { RequestHandler, Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequest from "../errors/bad-request";
import { ServicesProvider } from "../services/services-provider";

/**
 * Helper to get message from Joi
 * @param error Error form Joi
 * @returns Message from Joi, if available
 */
const getMessageFromJoiError = (
  error: Joi.ValidationError
): string | undefined => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? parseJoiMessage(error)
    : "Bad request.";
};

const parseJoiMessage = (error: Joi.ValidationError) => {
  const field = error.details[0].path.toString();
  const value = error._original[field];
  if (error.details[0].message.includes("required pattern:")) {
    return `Field '${field}' with value '${value}' fails to match requirements.`;
  } else {
    return error.details[0].message.replace(/\"/gi, "'") + ".";
  }
};

interface HandlerOptions {
  validation?: {
    body?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
  };
}

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 * @param handler Request handler to check for error
 */
export const requestMiddleware =
  (handler: RequestHandler, options?: HandlerOptions): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (options?.validation?.body) {
      const { error } = options?.validation?.body.validate(req.body);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }

    if (options?.validation?.params) {
      const { error } = options?.validation?.params.validate(req.params);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }
    if (options?.validation?.query) {
      const { error } = options?.validation?.query.validate(req.query);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }
    try {
      await handler(req, res, next);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        const SP = ServicesProvider.get();
        const logger = await SP.Logger();
        logger.error({
          message: "Error in request handler",
          error: err,
        });
      }

      next(err);
    }
  };

export default requestMiddleware;
