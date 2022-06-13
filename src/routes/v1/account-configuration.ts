import { Router } from "express";
import { AccountConfigurationController } from "../../controllers";
import creditAccount from "./credit-account";
import recurrentExpense from "./recurrent-expense";
import salary from "./salary";

const router = Router();

// Account configuration routes
router.post("/add", AccountConfigurationController.add);
router.get("/accountId/:accountId", AccountConfigurationController.get);
router.delete("/accountId/:accountId", AccountConfigurationController.remove);
router.post("/accountId/:accountId", AccountConfigurationController.update);

// Other configurations routes
router.use("/creditAccount", creditAccount);
router.use("/recurrentExpense", recurrentExpense);
router.use("/salary", salary);

export default router;
