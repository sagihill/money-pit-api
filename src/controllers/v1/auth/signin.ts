import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { AccountTypes, AuthTypes, UserTypes } from "../../../types";

export const signInRequestValidator = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

const signIn: RequestHandler = async (
  req: Request<{}, {}, AuthTypes.SignInRequest>,
  res
) => {
  try {
    const SP = ServicesProvider.get();
    const authService = await SP.Auth();
    const { email, password } = req.body;
    const response = await authService.signIn({ email, password });
    res.send({
      message: "Signed in successfully",
      responseCode: 200,
      data: {
        token: response.token,
      },
    });
  } catch (error: any) {
    res.send({
      message: "Failed to sign in",
      responseCode: 400,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    });
  }
};

export default requestMiddleware(signIn, {
  validation: { body: signInRequestValidator },
});
