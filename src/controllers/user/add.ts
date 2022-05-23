import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { UserTypes } from "../../types";

export const addUserRequestValidator = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  lastName: Joi.string()
    .required()
    .regex(/^[a-z ,.'-]+$/i),
  email: Joi.string().required().email(),
});

const add: RequestHandler = async (
  req: Request<{}, {}, UserTypes.AddUserRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();
  const { firstName, lastName, email } = req.body;
  const userDetails = await userService.add({ firstName, lastName, email });

  res.send({
    message: "Saved",
    user: JSON.stringify(userDetails),
  });
};

export default requestMiddleware(add, {
  validation: { body: addUserRequestValidator },
});
