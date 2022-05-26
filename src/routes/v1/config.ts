import { Router } from "express";

import { ConfigController } from "../../controllers";

const router = Router();

// Config routes
router.post("/add", ConfigController.add);
router.post("/edit", ConfigController.edit);

export default router;
