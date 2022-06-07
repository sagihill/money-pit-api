import { Request, Response, NextFunction } from "express";
import { ServicesProvider } from "../services/services-provider";

const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const SP = ServicesProvider.get();
    const auth = await SP.Auth();
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "JWT"
    ) {
      const response = await auth.authorize({
        token: req.headers.authorization.split(" ")[1],
      });
      if (response.isAuthorized) {
        next();
      } else {
        res.send({
          message: "Unauthorized",
          responseCode: 404,
        });
      }
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

export default authorize;
