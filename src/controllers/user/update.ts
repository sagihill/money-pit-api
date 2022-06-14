import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { ApiResponse, ResponseStatus, UserTypes } from "../../types";

export const updateUserRequestValidator = Joi.object().keys({
  accountId: Joi.string().uuid(),
  lastName: Joi.string().regex(/^[a-z ,.'-]+$/i),
  firstName: Joi.string().regex(/^[a-z ,.'-]+$/i),
  email: Joi.string().email(),
});

const update: RequestHandler = async (
  req: Request<any, {}, UserTypes.Requests.UpdateRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const userService = await SP.User();

    const { firstName, lastName, email, accountId } = req.body;
    await userService.update(req.params.id, {
      firstName,
      lastName,
      email,
      accountId,
    });

    const response: ApiResponse = {
      status: ResponseStatus.success,
      message: "User data updated.",
      data: {
        userId: req.params.id,
      },
    };

    res.send(response);
  } catch (error: any) {
    const response: ApiResponse = {
      status: ResponseStatus.error,
      message: "Unable to update user data",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(update, {
  validation: { body: updateUserRequestValidator },
});
