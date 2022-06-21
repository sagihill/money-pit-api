import { Router } from "express";

import config from "./config";
import tasks from "./tasks";
import authorize from "../../middleware/authorize";
import admin from "../../middleware/admin";

let adminRouter = Router();

adminRouter.use("/config", authorize, admin, config);
adminRouter.use("/task", authorize, admin, tasks);

export default adminRouter;
