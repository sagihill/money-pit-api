import { Request, RequestHandler } from "express";
import requestMiddleware from "../../middleware/request-middleware";
import { ServicesProvider } from "../../services/services-provider";

const get: RequestHandler = async (req: Request, res) => {
  const SP = ServicesProvider.get();
  const accountService = await SP.Account();
  const { id } = req.params;

  const account = await accountService.get(id);
  if (!account) {
    return res.status(404).send({
      error: "Account not found",
    });
  }
  return res.status(200).send({
    account: JSON.stringify(account),
  });
};

export default requestMiddleware(get);
