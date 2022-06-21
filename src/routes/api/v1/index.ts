import { Router } from "express";

import user from "./user";
import account from "./account";
import auth from "./auth";

import authorize from "../../../middleware/authorize";
import accounting from "./accounting";
import authentication from "../../../middleware/authentication";

let v1 = Router();

v1.use("/user", authorize, authentication, user);
v1.use("/account", authorize, authentication, account);
v1.use("/auth", auth);
v1.use("/accounting", authorize, authentication, accounting);

export default v1;
