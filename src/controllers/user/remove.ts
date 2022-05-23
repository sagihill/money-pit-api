import { Request, RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";

const remove: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();

  const { userId } = req.params;

  await userService.remove(userId);

  return res.status(204).send();
};

export default requestMiddleware(remove);
