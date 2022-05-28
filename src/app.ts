import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import rootRouter from "./routes/v1/rootRouter";
import { ServicesProvider } from "./services/services-provider";
import { Async } from "./lib/common";
import { WebCrawler } from "./services/web-crawler/web-crawler";

const app = express();
const SP = ServicesProvider.get();

function logResponseTime(req: Request, res: Response, next: NextFunction) {
  const startHrTime = process.hrtime();

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

app.use(logResponseTime);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use("/api", rootRouter);

app.use(
  (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      error: err.message,
    });
  }
);

Async.IIFE(async () => {
  const wb = new WebCrawler();
  await wb.login();
});

Async.IIFE(async () => {
  const EP = await SP.ExpesnseProcessor();
  await EP.run({ accountId: "e132f5e5-a715-4c1a-baad-af54242bb8bf" });
});

export default app;
