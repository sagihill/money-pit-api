import { Request, Response, NextFunction } from "express";
import { Utils } from "../lib";
import { ServicesProvider } from "../services/services-provider";
import { UserTypes } from "../types";

const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const SP = ServicesProvider.get();
    const userService = await SP.User();
    const userId = await Utils.getUserIdFromRequest(req);

    const user = await userService.get(userId);

    if (user?.role === UserTypes.UserRole.Admin) {
      next();
    } else {
      res.send({
        message: "Unauthorized",
        responseCode: 404,
      });
    }
  } catch (err) {
    next(err);
  }
};

export default admin;
