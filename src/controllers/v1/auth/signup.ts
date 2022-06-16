import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { TechTypes, UserTypes } from "../../../types";

export const signUpRequestValidator = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  lastName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  email: Joi.string().required().email(),
  password: Joi.string().required().length(16),
});

const signUp: RequestHandler = async (
  req: Request<{}, {}, UserTypes.Requests.AddRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const authService = await SP.Auth();
    const { firstName, lastName, email, password } = req.body;
    const result = await authService.signUp({
      firstName,
      lastName,
      email,
      password,
    });

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: "New user signed up.",
      data: {
        userId: result.id,
      },
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: "An error occured on signup",
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(signUp, {
  validation: { body: signUpRequestValidator },
});
