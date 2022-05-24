import { Router } from "express";
import { AuthController } from "../../controllers";

const router = Router();

// Auth routes
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;
