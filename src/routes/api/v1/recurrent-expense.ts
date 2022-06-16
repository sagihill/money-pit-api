import { Router } from "express";

import { V1 } from "../../../controllers";
const { RecurrentExpenseController } = V1;

const router = Router();

// Recurrent expense routes
router.post("/add", RecurrentExpenseController.add);
router.get("/", RecurrentExpenseController.get);
router.delete("/", RecurrentExpenseController.remove);
router.post("/", RecurrentExpenseController.update);

export default router;
