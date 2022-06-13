import { Router } from "express";

import { RecurrentExpenseController } from "../../controllers";

const router = Router();

// Recurrent expense routes
router.post("/add", RecurrentExpenseController.add);
router.get("/id/:id", RecurrentExpenseController.get);
router.delete("/id/:id", RecurrentExpenseController.remove);
router.post("/id/:id", RecurrentExpenseController.update);

export default router;
