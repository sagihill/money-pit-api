import { Request, RequestHandler } from "express";
import Joi from "joi";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";
import { UserTypes } from "../../types";

export const editUserRequestValidator = Joi.object().keys({
  accountId: Joi.string().uuid(),
  lastName: Joi.string().regex(/^[a-z ,.'-]+$/i),
  firstName: Joi.string().regex(/^[a-z ,.'-]+$/i),
  email: Joi.string().email(),
});

const edit: RequestHandler = async (
  req: Request<any, {}, UserTypes.EditUserRequest>,
  res
) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();

  const { firstName, lastName, email, accountId } = req.body;
  await userService.update(req.params.id, {
    firstName,
    lastName,
    email,
    accountId,
  });

  res.send({
    message: "User data edited",
    responseCode: 200,
    data: {
      userId: req.params.id,
    },
  });
};

export default requestMiddleware(edit, {
  validation: { body: editUserRequestValidator },
});
