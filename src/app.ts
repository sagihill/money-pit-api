import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import express, { Request, Response, NextFunction } from "express";
import ApplicationError from "./errors/application-error";
import rootRouter from "./routes/api/apiRouter";
import adminRouter from "./routes/admin/adminRouter";
import { logResponseTime } from "./middleware/logResponseTime";
import sanitize from "./middleware/santize";
import devRouter from "./routes/dev/devRouter";
import { getValidationErrorResponse } from "./errors/application-error-parser";
require("newrelic");

const app = express();

app.use(logResponseTime);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.use("/api", sanitize, rootRouter);
app.use("/admin", sanitize, adminRouter);
app.use("/dev", sanitize, devRouter);

app.use(
  (err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json(getValidationErrorResponse(err));
  }
);

export default app;
