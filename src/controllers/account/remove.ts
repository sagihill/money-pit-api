import { Request, RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";

const remove: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const account = await SP.Account();

  const { id } = req.params;

  await account.remove(id);

  res.send({
    message: "Deleted",
  });
};

export default requestMiddleware(remove);
