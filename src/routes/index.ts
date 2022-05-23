import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import apiSpec from "../../openapi.json";

import * as UserController from "../controllers/user";

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};

const router = Router();

// User routes
router.post("/user/add", UserController.add);
router.get("/user/id/:userId", UserController.get);
router.delete("/user/id/:userId", UserController.remove);
router.put("/user/id/:userId", UserController.edit);

// Dev routes
if (process.env.NODE_ENV === "development") {
  router.use("/dev/api-docs", swaggerUi.serve);
  router.get("/dev/api-docs", swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
