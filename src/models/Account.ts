import { Model, Schema, model } from "mongoose";
import { AccountTypes } from "../types";
import BaseEntitySchema from "./Base";
import Base from "./Base";

interface IAccountModel extends Model<AccountTypes.AccountDetails> {}

const schema = new Schema<AccountTypes.AccountDetails>(
  {
    id: { type: String, index: true, required: true },
    type: { type: String, index: true, required: true },
    adminUserId: { type: String, index: true, required: true },
    members: { type: [String], index: true, required: true },
    ...BaseEntitySchema,
  },
  { timestamps: true, collection: "Account" }
);

const Account: IAccountModel = model<
  AccountTypes.AccountDetails,
  IAccountModel
>("Account", schema);

export default Account;
