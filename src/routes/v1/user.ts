import { Router } from "express";
import { UserController } from "../../controllers";

const router = Router();

// User routes
router.get("/id/:id", UserController.get);
router.delete("/id/:id", UserController.remove);
router.put("/id/:id", UserController.update);

export default router;
