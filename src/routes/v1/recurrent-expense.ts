import { Router } from "express";

import { RecurrentExpenseController } from "../../controllers";

const router = Router();

// Recurrent expense routes
router.post("/add", RecurrentExpenseController.add);
router.get("/", RecurrentExpenseController.get);
router.delete("/", RecurrentExpenseController.remove);
router.post("/id/:id", RecurrentExpenseController.update);

export default router;
