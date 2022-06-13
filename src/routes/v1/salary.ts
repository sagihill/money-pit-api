import { Router } from "express";

import { SalaryController } from "../../controllers";

const router = Router();

// Salary routes
router.post("/add", SalaryController.add);
router.get("/id/:id", SalaryController.get);
router.delete("/id/:id", SalaryController.remove);
router.post("/id/:id", SalaryController.update);

export default router;
