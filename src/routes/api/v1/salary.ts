import { Router } from "express";

import { V1 } from "../../../controllers";
const { SalaryController } = V1;

const router = Router();

// Salary routes
router.post("/add", SalaryController.add);
router.get("/", SalaryController.get);
router.delete("/", SalaryController.remove);
router.post("/", SalaryController.update);

export default router;
