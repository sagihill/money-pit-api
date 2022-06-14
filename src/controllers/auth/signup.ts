import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { UserTypes } from "../../types";

export const signUpRequestValidator = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  lastName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

const signUp: RequestHandler = async (
  req: Request<{}, {}, UserTypes.AddUserRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const authService = await SP.Auth();
    const { firstName, lastName, email, password } = req.body;
    const response = await authService.signUp({
      firstName,
      lastName,
      email,
      password,
    });

    res.send({
      message: "New user signed up",
      responseCode: 200,
      data: {
        userId: response.id,
      },
    });
  } catch (error: any) {
    res.send({
      message: "An error occured on signup",
      responseCode: 400,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    });
  }
};

export default requestMiddleware(signUp, {
  validation: { body: signUpRequestValidator },
});
