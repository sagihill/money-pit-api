import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import rootRouter from "./routes/v1/rootRouter";
import adminRouter from "./routes/admin/adminRouter";
import { Async } from "./lib";
import boot from "./boot";
import { logResponseTime } from "./middleware/logResponseTime";

const app = express();

app.use(logResponseTime);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use("/api", rootRouter);
app.use("/admin", adminRouter);

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
  await boot();
});

export default app;
