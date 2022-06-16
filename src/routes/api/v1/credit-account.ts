import { Router } from "express";

import { V1 } from "../../../controllers";
const { CreditAccountController } = V1;

const router = Router();

// Credit account routes
router.post("/add", CreditAccountController.add);
router.delete("/", CreditAccountController.remove);
router.get("/", CreditAccountController.get);
router.post("/", CreditAccountController.update);

export default router;
