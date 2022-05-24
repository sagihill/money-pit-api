import { Request, RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";

const get: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();
  const { id } = req.params;

  const user = await userService.get(id);
  if (!user) {
    return res.status(404).send({
      error: "User not found",
    });
  }
  return res.status(200).send({
    message: "New user created",
    responseCode: 200,
    data: {
      userId: user.id,
    },
  });
};

export default requestMiddleware(get);
