import { Router } from "express";

import { SalaryController } from "../../controllers";

const router = Router();

// Salary routes
router.post("/add", SalaryController.add);
router.get("/", SalaryController.get);
router.delete("/", SalaryController.remove);
router.post("/", SalaryController.update);

export default router;
