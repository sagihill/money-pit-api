import { Router } from "express";

import user from "./user";
import account from "./account";

import swaggerUi from "swagger-ui-express";
import apiSpec from "../../openapi.json";

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};
let rootRouter = Router();

rootRouter.use("/user", user);
rootRouter.use("/account", account);

// Dev routes
if (process.env.NODE_ENV === "development") {
  rootRouter.use("/dev/api-docs", swaggerUi.serve);
  rootRouter.get("/dev/api-docs", swaggerUi.setup(apiSpec, swaggerUiOptions));
}
export default rootRouter;
