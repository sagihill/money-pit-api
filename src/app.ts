import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import rootRouter from "./routes/v1/rootRouter";
import { ServicesProvider } from "./services/services-provider";
import { Async, Sync } from "./lib/common";
import { ExpenseSheets } from "./services/expense-sheets/expense-sheets";
import { ExpenseSheetsTypes } from "./types";

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
  const ES = await SP.ExpesnseSheets();
  const config = await SP.Config();
  const params: ExpenseSheetsTypes.ExpesnseSheetsParams = {
    creditProviderWebsiteUrl: (await config.get("BANK_URL")) ?? "",
    credentials: {
      username: (await config.get("BANK_USERNAME")) ?? "",
      password: (await config.get("BANK_PASSWORD")) ?? "",
    },
    accountId: (await config.get("ACCOUNT_ID")) ?? "",
  };

  await ES.run(params);
  await Sync.sleep(5000);
  const EP = await SP.ExpesnseProcessor();
  await EP.run({ accountId: (await config.get("ACCOUNT_ID")) ?? "" });
});

// Async.IIFE(async () => {
//   const EP = await SP.ExpesnseProcessor();
//   const config = await SP.Config();
//   await EP.run({ accountId: (await config.get("ACCOUNT_ID")) ?? "" });
// });

export default app;
