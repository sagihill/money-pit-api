import { Router } from "express";

import { CreditAccountController } from "../../controllers";

const router = Router();

// Credit account routes
router.post("/add", CreditAccountController.add);
router.delete("/", CreditAccountController.remove);
router.post("/id/:id", CreditAccountController.update);

export default router;
