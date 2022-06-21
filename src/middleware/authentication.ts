import { Request, Response, NextFunction } from "express";
import { Utils } from "../lib";
import { ServicesProvider } from "../services/services-provider";
import { TechTypes, UserTypes } from "../types";

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const SP = ServicesProvider.get();
    const authService = await SP.Auth();
    const userService = await SP.User();
    const token = Utils.getTokenFromRequest(req);
    if (!token) {
      throw new TechTypes.AuthTokenMissingError();
    }

    const auth = await authService.getAuth(token);

    const user = await userService.get(auth.userId);

    if (!user) {
      throw new UserTypes.UserNotFound();
    } else if (user.status === UserTypes.UserStatus.Authenticated) {
      next();
    } else {
      res.status(404).send({
        status: TechTypes.ResponseStatus.failure,
        message: "Unauthorized",
      });
    }
  } catch (err) {
    next(err);
  }
};

export default authentication;
