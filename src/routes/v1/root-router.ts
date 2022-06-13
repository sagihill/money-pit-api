import { Router } from "express";

import user from "./user";
import account from "./account";
import auth from "./auth";

import swaggerUi from "swagger-ui-express";
import apiSpec from "../../../openapi.json";
import authorize from "../../middleware/authorize";
import accounting from "./accounting";

const swaggerUiOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
};

let rootRouter = Router();

rootRouter.use("/v1/user", authorize, user);
rootRouter.use("/v1/account", authorize, account);
rootRouter.use("/v1/auth", auth);
rootRouter.use("/v1/accounting", authorize, accounting);

// Dev routes
if (process.env.NODE_ENV === "development") {
  rootRouter.use("/v1/dev/api-docs", swaggerUi.serve);
  rootRouter.get(
    "/v1/dev/api-docs",
    swaggerUi.setup(apiSpec, swaggerUiOptions)
  );
}
export default rootRouter;
