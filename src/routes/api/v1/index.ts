import { Router } from "express";

import user from "./user";
import account from "./account";
import auth from "./auth";

import authorize from "../../../middleware/authorize";
import accounting from "./accounting";

let v1 = Router();

v1.use("/user", authorize, user);
v1.use("/account", authorize, account);
v1.use("/auth", auth);
v1.use("/accounting", authorize, accounting);

export default v1;
