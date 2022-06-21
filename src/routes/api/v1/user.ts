import { Router } from "express";

import { V1 } from "../../../controllers";
const { UserController } = V1;

const router = Router();

// User routes
router.get("/", UserController.get);
router.delete("/", UserController.remove);
router.put("/update", UserController.update);

export default router;
