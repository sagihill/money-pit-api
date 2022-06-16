import { Router } from "express";
import configuration from "./account-configuration";

import { V1 } from "../../../controllers";
const { AccountController } = V1;

const router = Router();

// Account routes
router.post("/add", AccountController.add);
router.get("/id/:id", AccountController.get);
router.delete("/id/:id", AccountController.remove);

// Account configuration routing
router.use("/configuration", configuration);

export default router;
