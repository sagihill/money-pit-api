import { Router } from "express";

import { AccountingController } from "../../controllers";

const router = Router();

// Account routes
router.post("/add", AccountingController.add);
router.get("/summery", AccountingController.summery);

export default router;
