import { Router } from "express";

import { AccountingController } from "../../controllers";

const router = Router();

// Accounting routes
router.post("/add", AccountingController.add);
router.get("/summery", AccountingController.summery);

export default router;
