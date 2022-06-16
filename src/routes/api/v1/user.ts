import { Router } from "express";

import { V1 } from "../../../controllers";
const { UserController } = V1;

const router = Router();

// User routes
router.get("/id/:id", UserController.get);
router.delete("/id/:id", UserController.remove);
router.put("/id/:id", UserController.update);

export default router;
