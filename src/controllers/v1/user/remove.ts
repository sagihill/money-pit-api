import { Request, RequestHandler } from "express";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";

const remove: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const userService = await SP.User();

  const { id } = req.params;

  await userService.remove(id);

  res.send({
    message: "deleted",
  });
};

export default requestMiddleware(remove);
