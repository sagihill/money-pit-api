import { Request, RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import User from "../../models/User";
import { ServicesProvider } from "../../services/services-provider";

const get: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();
  const { userId } = req.params;

  const user = await userService.get(userId);
  if (!user) {
    return res.status(404).send({
      error: "User not found",
    });
  }
  return res.status(200).send({
    user: JSON.stringify(user),
  });
};

export default requestMiddleware(get);
