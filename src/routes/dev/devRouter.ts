import { Router } from "express";

import swaggerUi from "swagger-ui-express";
import apiSpec from "../../../openapi.json";
import { Async } from "../../lib";
import { ServicesProvider } from "../../services/services-provider";

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};

let devRouter = Router();

Async.IIFE(async () => {
  const SP = ServicesProvider.get();
  const config = await SP.Config();
  if ((await config.get("NODE_ENV")) === "development") {
    devRouter.use("/api-docs", swaggerUi.serve);
    devRouter.get("/api-docs", swaggerUi.setup(apiSpec, swaggerUiOptions));
  }
});

export default devRouter;
