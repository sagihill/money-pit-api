import { Router } from "express";

import config from "./config";
import authorize from "../../middleware/authorize";
import admin from "../../middleware/admin";

let adminRouter = Router();

adminRouter.use("/config", authorize, admin, config);

export default adminRouter;
