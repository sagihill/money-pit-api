import { Router } from "express";

import { Admin } from "../../controllers";
const { TaskController } = Admin;
const router = Router();

// Task routes
router.post("/", TaskController.run);

export default router;
