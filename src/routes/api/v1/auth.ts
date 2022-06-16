import { Router } from "express";

import { V1 } from "../../../controllers";
const { AuthController } = V1;

const router = Router();

// Auth routes
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;
