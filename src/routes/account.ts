import { Router } from "express";

import { AccountController } from "../controllers";

const router = Router();

// User routes
router.post("/add", AccountController.add);
router.get("/id/:id", AccountController.get);
router.delete("/id/:id", AccountController.remove);
router.put("/id/:id", AccountController.edit);

export default router;
