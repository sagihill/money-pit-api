import { Router } from "express";
import creditAccount from "./credit-account";
import recurrentExpense from "./recurrent-expense";
import salary from "./salary";

import { V1 } from "../../../controllers";
const { AccountConfigurationController } = V1;

const router = Router();

// Account configuration routes
router.post("/add", AccountConfigurationController.add);
router.get("/accountId/:accountId", AccountConfigurationController.get);
router.delete("/", AccountConfigurationController.remove);
router.post("/", AccountConfigurationController.update);

// Other configurations routes
router.use("/creditAccount", creditAccount);
router.use("/recurrentExpense", recurrentExpense);
router.use("/salary", salary);

export default router;
