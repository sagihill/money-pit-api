import { Router } from "express";

import {
  AccountController,
  AccountConfigurationController,
} from "../../controllers";

const router = Router();

// Account routes
router.post("/add", AccountController.add);
router.get("/id/:id", AccountController.get);
router.delete("/id/:id", AccountController.remove);
router.post("/configuration", AccountConfigurationController.update);
router.get(
  "/configuration",
  AccountConfigurationController.displayConfiguration
);

export default router;
