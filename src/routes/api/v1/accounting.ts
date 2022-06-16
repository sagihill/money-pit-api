import { Router } from "express";

import { V1 } from "../../../controllers";
const { AccountingController } = V1;

const router = Router();

// Accounting routes
router.post("/add", AccountingController.add);
router.get("/summery", AccountingController.summery);
router.post("/", AccountingController.update);
router.delete("/", AccountingController.remove);

export default router;
