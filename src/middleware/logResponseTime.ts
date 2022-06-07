import { Request, Response, NextFunction } from "express";
import { Async } from "../lib";
import { ServicesProvider } from "../services/services-provider";

export function logResponseTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startHrTime = process.hrtime();
  const SP = ServicesProvider.get();

  res.on("finish", () => {
    Async.IIFE(async () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
      const logger = await SP.Logger();
      logger.log({
        level: "debug",
        message,
        consoleLoggerOptions: { label: "API" },
      });
    });
  });
  next();
}
