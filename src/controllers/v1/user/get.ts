import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Utils } from "../../../lib";
import requestMiddleware from "../../../middleware/request-middleware";
import { ServicesProvider } from "../../../services/services-provider";
import { TechTypes } from "../../../types";

const get: RequestHandler = async (req: Request, res) => {
  try {
    const SP = ServicesProvider.get();
    const userService = await SP.User();
    const id = await Utils.getUserIdFromRequest(req);
    const user = await userService.getUserInfo({ id });
    console.log(user);
    let response: TechTypes.ApiResponse;

    if (!user) {
      response = {
        status: TechTypes.ResponseStatus.failure,
        message: "User not found.",
      };
    } else {
      response = {
        status: TechTypes.ResponseStatus.success,
        message: "Found user.",
        data: {
          user,
        },
      };
    }

    res.status(200).send(response);
  } catch (error) {
    const response = {
      status: TechTypes.ResponseStatus.error,
      message: "User find request had an error.",
      error,
    };

    res.status(400).send(response);
  }
};

export default requestMiddleware(get);
