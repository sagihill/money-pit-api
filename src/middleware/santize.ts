import { NextFunction, Request } from "express";
import { Objects } from "../lib";

const sanitize = (req: Request, res: any, next: NextFunction) => {
  let _send = res.send;
  res.send = function (body: any) {
    const sanitized = Objects.Sanitize(body, ["password,all", "username,part"]);
    res.send = _send;
    return res.send(sanitized);
  };
  next();
};

export default sanitize;
