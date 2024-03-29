import { Request, RequestHandler } from "express";
import { Utils } from "../../../lib";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { TechTypes } from "../../../types";

const remove: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const userService = await SP.User();

    const id = await Utils.getUserIdFromRequest(req);
    await userService.remove(id);

    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.success,
      message: `User ${id} deleted successfully.`,
    };

    res.send(response);
  } catch (error: any) {
    const response: TechTypes.ApiResponse = {
      status: TechTypes.ResponseStatus.error,
      message: `removing user had an error.`,
      error: {
        name: error.constructor.name,
        message: error.message,
      },
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(remove);
