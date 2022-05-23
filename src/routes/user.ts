import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import apiSpec from "../../openapi.json";

import { UserController } from "../controllers";

const router = Router();

// User routes
router.post("/add", UserController.add);
router.get("/id/:id", UserController.get);
router.delete("/id/:id", UserController.remove);
router.put("/id/:id", UserController.edit);

export default router;
